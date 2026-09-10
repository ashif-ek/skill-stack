export default function GoalCard({ goal, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-md border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
            {goal.skill_name}
          </h3>

          <p className="mt-1 text-sm font-medium text-neutral-500">
            {goal.category} &bull; {goal.platform}
          </p>
        </div>

        <span 
          className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            goal.status === "completed" ? "border-neutral-800 bg-neutral-800 text-white" :
            goal.status === "in_progress" ? "border-neutral-300 bg-neutral-100 text-neutral-700" :
            "border-neutral-200 bg-white text-neutral-500"
          }`}
        >
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-neutral-500">Progress</span>
          <span className="font-bold text-neutral-900">{goal.progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden bg-neutral-100">
          <div
            className="h-full bg-neutral-900 transition-all duration-500 ease-out"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center text-sm font-medium text-neutral-500">
        <svg className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {goal.total_hours || 0} hours
        <span className="mx-2 text-neutral-300">|</span>
        <span className="capitalize text-neutral-600">{goal.difficulty}</span>
      </div>
    </div>
  );
}