import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type RequestStatus } from '@prisma/client';
import { BadgeVariants } from '~/components/ui/badge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapStatusToVariant(
  status: RequestStatus,
): BadgeVariants['variant'] {
  switch (status) {
    case 'PENDING':
      return 'default';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'destructive';
    case 'CANCELLED':
      return 'secondary';
    default:
      return 'default';
  }
}
