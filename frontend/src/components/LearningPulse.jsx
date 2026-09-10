export default function LearningPulse({ pulse }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Learning Pulse</h2>
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Last 7 Days</span>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-xs text-slate-500 pb-2 border-b border-slate-50">
          {pulse.momentum === 'Strong' ? "You're on a great streak. Keep the momentum going!" :
           pulse.momentum === 'Good' ? "Consistent progress. Every hour counts." :
           "Ready to pick up where you left off?"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Momentum</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900">
            <span className={`inline-block h-2 w-2 rounded-full ${
              pulse.momentum === 'Strong' ? 'bg-blue-600' :
              pulse.momentum === 'Good' ? 'bg-slate-400' :
              'bg-slate-300'
            }`}></span>
            {pulse.momentum}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Learning Time</span>
          <span className="text-sm font-medium text-slate-900">{pulse.weekly_hours} hrs</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Active Days</span>
          <span className="text-sm font-medium text-slate-900">{pulse.active_days} / 7</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Avg. Progress</span>
          <span className="text-sm font-medium text-slate-900">{pulse.average_progress}%</span>
        </div>
      </div>
    </div>
  );
}
