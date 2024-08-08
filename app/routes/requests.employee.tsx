import { RequestStatus, VacationRequest } from '@prisma/client';
import { Link } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { useTypedLoaderData } from 'remix-typedjson';
import DataTable from '~/components/dataTable';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { mapStatusToVariant } from '~/lib/utils';
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
    accessorKey: 'requester.name',
    header: 'Name',
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
    header: '',
    cell: ({ cell }) => (
      <Button asChild>
        <Link to={`/request/${cell.getValue()}`}>Open</Link>
      </Button>
    ),
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

export async function loader() {
  return await prisma.vacationRequest.findMany({
    where: {
      requester: {
        role: 'EMPLOYEE',
      },
    },
    include: {
      requester: {
        select: {
          name: true,
        },
      },
    },
  });
}
