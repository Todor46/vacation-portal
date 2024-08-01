import { VacationRequest } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Response } from '~/utils/misc.server';
import { toast } from './ui/use-toast';

const CancelRequestDialog = ({ id }: { id: VacationRequest['id'] }) => {
  const fetcher = useFetcher<Response<VacationRequest>>();
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    fetcher.submit(
      { id },
      {
        method: 'post',
        action: '/request/cancel',
        encType: 'application/json',
      },
    );
  };

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data?.success === true) {
      setOpen(false);
      toast({
        title: 'Request cancelled',
        description: 'Your request has been cancelled',
      });
    }
    if (fetcher.data?.success === false) {
      toast({
        title: 'Request cancellation failed',
        description: fetcher.data?.message,
      });
    }
  }, [fetcher.data]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Cancel request
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelling the request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your request?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleCancel()}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelRequestDialog;
