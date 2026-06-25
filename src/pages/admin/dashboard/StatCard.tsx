interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

export default function StatCard(props: StatCardProps) {
  if (!props || !props.title) return null;
  const { title, value, icon } = props;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
