export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Your learning trail</h2>
      </div>
      <div className="divide-y divide-slate-100 p-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1 pr-3">
              <p className="truncate text-xs font-medium text-slate-900">
                {activity.skill}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {activity.date}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
              {activity.hours}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
