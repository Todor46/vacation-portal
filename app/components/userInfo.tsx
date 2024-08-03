import { RequestByIdLoaderData } from '~/routes/request.$id';
import { format, isValid, parseISO } from 'date-fns';

const VacationInfo = ({
  vacationRequest,
}: {
  vacationRequest: RequestByIdLoaderData['vacationRequest'];
}) => {
  const fields = [
    {
      label: 'Name',
      value: vacationRequest.requester.name,
    },
    {
      label: 'Email',
      value: vacationRequest.requester.email,
    },
    {
      label: 'Start Date',
      value: vacationRequest.startDate,
    },
    {
      label: 'End Date',
      value: vacationRequest.endDate,
    },
    {
      label: 'Reason',
      value: vacationRequest.reason,
    },
    {
      label: 'Status',
      value: vacationRequest.status,
    },
    {
      label: 'Comment',
      value: vacationRequest.comment,
    },
    {
      label: 'Approver',
      value: vacationRequest.approver?.name,
    },
    {
      label: 'Created At',
      value: vacationRequest.createdAt,
    },
  ];

  const mapValue = (value: (typeof fields)[number]['value']) => {
    if (
      value instanceof Date ||
      (typeof value === 'string' && isValid(parseISO(value)))
    ) {
      const date = value instanceof Date ? value : parseISO(value);
      return format(date, 'PPP'); // Format: Apr 29, 2023
    }
    return value?.toString() ?? '';
  };

  return (
    <div className="container rounded-lg grid grid-cols-6 gap-y-6 mb-20 p-8 bg-secondary">
      {fields.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2"
        >
          <div className="font-medium">{item.label}</div>
          <div>{mapValue(item.value)}</div>
        </div>
      ))}
    </div>
  );
};

export default VacationInfo;
