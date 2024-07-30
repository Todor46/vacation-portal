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
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { VacationRequestResponse } from '~/routes/request';

const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher<VacationRequestResponse>();
  const form = useForm({
    resolver: zodResolver(requestSchema),
  });

  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<FieldValues> = (values) => {
    fetcher.submit(JSON.stringify(values), {
      method: 'post',
      action: '/request',
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
    if (!fetcher?.data?.success) {
      toast({
        title: 'Request failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }, [fetcher.data, toast, navigate, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger>
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
              <Button
                disabled={fetcher.state === 'submitting'}
                type="submit"
              >
                {fetcher.state === 'submitting' ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit
              </Button>
            </div>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
