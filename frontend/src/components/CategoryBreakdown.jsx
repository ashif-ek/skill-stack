export default function CategoryBreakdown({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Where your time is going</h2>
      </div>
      <div className="p-4 space-y-4">
        {breakdown.map((item) => (
          <div key={item.category}>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="text-slate-700">{item.category}</span>
              <span className="text-slate-500">{item.hours || 0}h</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-400"
                style={{ width: `${Math.min(Number(item.hours) * 5, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
