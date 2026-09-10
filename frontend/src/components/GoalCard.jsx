export default function GoalCard({ goal, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {goal.skill_name}
          </h3>

          <p className="mt-1 text-sm text-gray-500 font-medium">
            {goal.category} &bull; {goal.platform}
          </p>
        </div>

        <span 
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            goal.status === "completed" ? "bg-green-100 text-green-700" :
            goal.status === "in_progress" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-600"
          }`}
        >
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-500">Progress</span>
          <span className="font-bold text-gray-900">{goal.progress}%</span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 shadow-inner">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center text-sm font-medium text-gray-500">
        <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {goal.total_hours || 0} hours
        <span className="mx-2 text-gray-300">|</span>
        <span className={`capitalize ${
          goal.difficulty === 'easy' ? 'text-green-600' :
          goal.difficulty === 'hard' ? 'text-red-500' :
          'text-orange-500'
        }`}>{goal.difficulty}</span>
      </div>
    </div>
  );
}