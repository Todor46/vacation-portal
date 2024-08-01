import { User, VacationRequest } from '@prisma/client';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/utils/db.server';

type LoaderData = {
  vacationRequest: VacationRequest & { requester: User };
  user: User;
};

const Request = () => {
  const { vacationRequest, user } = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.success === false) {
      toast({
        title: actionData?.message,
        variant: 'destructive',
      });
    }
    if (actionData?.success === true) {
      toast({
        title: actionData?.message,
        description: 'Your request has been updated.',
      });
    }
  }, [actionData]);
  return (
    <div className="container">
      {JSON.stringify(vacationRequest?.requester, null, 2)}
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={{
          from: new Date(vacationRequest?.startDate),
          to: new Date(vacationRequest?.endDate),
        }}
        disableNavigation
        disabled
        defaultMonth={new Date(vacationRequest?.startDate)}
      />
      {vacationRequest?.status === 'PENDING' && user.role === 'MANAGER' && (
        <Form
          method="post"
          className="flex flex-col gap-4 max-w-md mt-4"
        >
          <RadioGroup
            defaultValue="approved"
            className="mb-4"
            name="status"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="approved"
                id="approved"
              />
              <Label htmlFor="Accepted">Approve</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="rejected"
                id="rejected"
              />
              <Label htmlFor="rejected">Reject</Label>
            </div>
          </RadioGroup>
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            name="comment"
          />
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </div>
  );
};

export default Request;

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 });
  }
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  const vacationRequest = await prisma.vacationRequest.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      requester: true,
    },
  });
  if (!vacationRequest) {
    throw new Response('Not Found', { status: 404 });
  }
  return json<LoaderData>({ vacationRequest, user });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const vacationRequest = await prisma.vacationRequest.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  const formData = await request.formData();
  const status = formData.get('status')?.toString().toUpperCase();
  const comment = formData.get('comment')?.toString();
  const validStatuses: VacationRequest['status'][] = ['APPROVED', 'REJECTED'];

  if (user?.role !== 'MANAGER') {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  if (vacationRequest?.status !== 'PENDING') {
    return json({ success: false, message: 'Request already processed' });
  }
  if (!status || !validStatuses.includes(status as VacationRequest['status'])) {
    return json({ success: false, message: 'Invalid status' });
  }
  try {
    await prisma.vacationRequest.update({
      where: {
        id: Number(params.id),
      },
      data: {
        status: status as VacationRequest['status'],
        comment: comment as string,
        approverId: user.id,
      },
    });
    return json({ success: true, message: 'Request updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: 'Error updating request' });
  }
}
