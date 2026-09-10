export default function GoalCard({ goal }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {goal.skill_name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {goal.category} · {goal.platform}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-black"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {goal.total_hours || 0} hours · {goal.difficulty}
      </div>
    </div>
  );
}