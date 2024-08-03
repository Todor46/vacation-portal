const Days = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="text-7xl font-medium size-48 border-8 border-primary rounded-full flex items-center justify-center mb-6">
        {value}
      </div>
      <div className="text-lg font-medium">{label}</div>
    </div>
  );
};

export default Days;
