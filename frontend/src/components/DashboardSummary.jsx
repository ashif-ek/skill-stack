export default function DashboardSummary({ stats }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Dashboard Summary</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Skills</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total_skills}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hours</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total_hours || 0}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">In Prog.</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.in_progress}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Done</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
