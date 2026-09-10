export default function GoalCard({ goal, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {goal.skill_name}
          </h3>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {goal.category} &bull; {goal.platform}
          </p>
        </div>

        <span 
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            goal.status === "completed" ? "border-slate-800 bg-slate-800 text-white" :
            goal.status === "in_progress" ? "border-slate-300 bg-slate-50 text-slate-700 shadow-sm" :
            "border-slate-200 bg-white text-slate-500"
          }`}
        >
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-500">Progress</span>
          <span className="font-bold text-slate-900">{goal.progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center text-sm font-medium text-slate-500">
        <svg className="mr-1.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {goal.total_hours || 0} hours
        <span className="mx-2 text-slate-300">|</span>
        <span className="capitalize text-slate-600">{goal.difficulty}</span>
      </div>
    </div>
  );
}