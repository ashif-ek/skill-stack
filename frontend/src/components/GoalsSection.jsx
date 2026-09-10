import GoalCard from "./GoalCard";

export default function GoalsSection({ goals, onSelectGoal }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Your Learning Goals
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={() => onSelectGoal(goal.id)}
          />
        ))}
        {goals.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 px-4 text-center">
            <p className="text-sm font-medium text-slate-900">Your learning journey starts here.</p>
            <p className="mt-1 text-xs text-slate-500">Click "Add Goal" to create your first skill and begin tracking.</p>
          </div>
        )}
      </div>
    </section>
  );
}
