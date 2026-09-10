export default function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}