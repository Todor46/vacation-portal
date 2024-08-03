import Days from '~/components/days';

const MyDays = () => {
  const dummyData = [
    {
      label: 'Available days',
      value: 24,
    },
    {
      label: 'Used days',
      value: 10,
    },
    {
      label: 'Remaining days',
      value: 10,
    },
    {
      label: 'Sick days',
      value: 5,
    },
  ];
  return (
    <div className="container">
      <h1 className="text-3xl font-semibold mt-16 mb-24">My days</h1>
      <div className="grid grid-cols-4 gap-10">
        {dummyData.map((data) => (
          <Days
            key={data.label}
            label={data.label}
            value={data.value}
          />
        ))}
      </div>
    </div>
  );
};

export default MyDays;
