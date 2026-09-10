export default function DashboardHeader({ onAddGoal }) {
  return (
    <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="SkillStack Logo" className="h-10 w-10 rounded-lg shadow-sm object-cover" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            SkillStack
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Build skills. Track progress. Keep moving.
          </p>
        </div>
      </div>
      <button
        onClick={onAddGoal}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Goal
      </button>
    </header>
  );
}
