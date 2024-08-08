import { RequestStatus, VacationRequest } from '@prisma/client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs } from '@remix-run/node';
import { ColumnDef } from '@tanstack/react-table';
import { useTypedLoaderData } from 'remix-typedjson';
import CancelRequestDialog from '~/components/cancelRequestDialog';
import DataTable from '~/components/dataTable';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { mapStatusToVariant } from '~/lib/utils';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/utils/db.server';

const columns: ColumnDef<VacationRequest>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell }) => (
      <Badge variant={mapStatusToVariant(cell.getValue() as RequestStatus)}>
        {cell.getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    cell: ({ cell }) => {
      return new Date(cell.getValue() as string).toLocaleDateString();
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End',
    cell: ({ cell }) => {
      return new Date(cell.getValue() as string).toLocaleDateString();
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
  },
  {
    accessorKey: 'id',
    header: 'Action',
    size: 0,
    cell: ({ row, cell }) => {
      return row.getValue('status') === 'PENDING' ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-8 h-8 p-0"
            >
              <DotsHorizontalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <CancelRequestDialog id={Number(cell.getValue())} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null;
    },
  },
];

const Requests = () => {
  const req = useTypedLoaderData<typeof loader>();
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={req}
      />
    </div>
  );
};

export default Requests;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return await prisma.vacationRequest.findMany({
    where: {
      requesterId: user?.id,
    },
  });
}
