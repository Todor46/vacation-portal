import { Button } from './ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './ui/dialog';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { requestSchema } from '~/schemas/requestSchema';
import { Form, useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { Response } from '~/utils/misc.server';
import { VacationRequest } from '@prisma/client';
import SubmitButton from './submitButton';

const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher<Response<VacationRequest>>();
  const form = useForm({
    resolver: zodResolver(requestSchema),
  });

  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<FieldValues> = (values) => {
    fetcher.submit(JSON.stringify(values), {
      method: 'post',
      action: '/request/create',
      encType: 'application/json',
    });
  };

  useEffect(() => {
    if (fetcher?.data?.success) {
      const requestId = fetcher?.data?.data?.id;
      toast({
        title: 'Vacation request created',
        description: 'Your request has been successfully created.',
        action: (
          <ToastAction
            className="bg-background"
            altText="open"
            onClick={() => navigate('/request/' + requestId)}
          >
            Open
          </ToastAction>
        ),
        variant: 'success',
      });
      setOpen(false);
      form.reset();
    }
    if (fetcher?.data?.success === false) {
      toast({
        title: 'Request failed',
        description: fetcher?.data?.message,
        variant: 'destructive',
      });
    }
  }, [fetcher.data, toast, navigate, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>New Request</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select desirable dates for your vacation</DialogTitle>
          <DialogDescription>
            Your request will have to be approved by your manager.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      onSelect={field.onChange}
                      selected={field.value}
                      fromDate={new Date()}
                      classNames={{
                        months:
                          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-between',
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-4 justify-end">
              <DialogClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </DialogClose>
              <SubmitButton isSubmitting={fetcher.state === 'submitting'}>
                Submit
              </SubmitButton>
            </div>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
