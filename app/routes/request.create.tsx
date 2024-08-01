import { VacationRequest } from '@prisma/client';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { requestSchema, RequestSchemaType } from '~/schemas/requestSchema';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/utils/db.server';
import { ErrorResponse, SuccessResponse } from '~/utils/misc.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user)
    return json<ErrorResponse>(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );

  let body: RequestSchemaType;

  const pendingRequest = await prisma.vacationRequest.findFirst({
    where: {
      requesterId: user.id,
      status: 'PENDING',
    },
  });

  if (pendingRequest)
    return json<ErrorResponse>(
      { success: false, message: 'Already have an open request' },
      { status: 400, statusText: 'pending-request-exists' },
    );

  try {
    const rawBody = await request.json();

    body = requestSchema.parse(rawBody);
  } catch (error) {
    return json<ErrorResponse>(
      { success: false, message: 'Invalid request data' },
      { status: 400 },
    );
  }

  try {
    const vacation = await prisma.vacationRequest.create({
      data: {
        startDate: body.date.from,
        endDate: body.date.to,
        reason: body.reason,
        requesterId: user.id,
      },
    });
    return json<SuccessResponse<VacationRequest>>({
      success: true,
      data: vacation,
    });
  } catch (err) {
    console.error('Could not create request', err);
    return json<ErrorResponse>(
      { success: false, message: 'Could not create request' },
      { status: 500 },
    );
  }
}
