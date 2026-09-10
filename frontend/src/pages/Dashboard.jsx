import { useEffect, useState } from "react";

import AddGoalModal from "../components/AddGoalModal";
import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import GoalDetailsModal from "../components/GoalDetailsModal";
import { getDashboard, getGoals } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, goalsData] = await Promise.all([
        getDashboard(),
        getGoals(),
      ]);

      setDashboard(dashboardData);
      setGoals(goalsData);
    } catch (err) {
      setError("Unable to load your learning data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading SkillStack...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const stats = dashboard.stats;
  const pulse = dashboard.learning_pulse;

  return (
    <main className="min-h-screen bg-white font-sans text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-neutral-500 uppercase">
              SkillStack
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Learning Dashboard
            </h1>
            <p className="mt-2 text-base text-neutral-500">
              Track your progress and build better learning habits.
            </p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Add Goal
          </button>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Skills"
            value={stats.total_skills}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
          />

          <StatCard
            title="In Progress"
            value={stats.in_progress}
          />

          <StatCard
            title="Total Hours"
            value={`${stats.total_hours || 0}h`}
          />
        </section>

        {/* Learning Pulse */}
        <section className="mt-8 overflow-hidden rounded-md border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Learning Pulse
              </p>
              <h2 className="mt-1 text-lg font-medium text-neutral-900 flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  pulse.momentum === 'Strong' ? 'bg-neutral-900' :
                  pulse.momentum === 'Good' ? 'bg-neutral-500' :
                  'bg-neutral-300'
                }`}></span>
                {pulse.momentum} momentum
              </h2>
            </div>

            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                Last 7 days
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-neutral-200 sm:grid-cols-3">
            <div className="bg-white p-6">
              <p className="text-sm font-medium text-neutral-500">
                Learning time
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-neutral-900">{pulse.weekly_hours}</span>
                <span className="text-sm font-medium text-neutral-500">hours</span>
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-sm font-medium text-neutral-500">
                Active days
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-neutral-900">{pulse.active_days}</span>
                <span className="text-sm font-medium text-neutral-500">/ 7</span>
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-sm font-medium text-neutral-500">
                Average progress
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-neutral-900">{pulse.average_progress}</span>
                <span className="text-sm font-medium text-neutral-500">%</span>
              </p>
            </div>
          </div>
        </section>

        {/* Goals + Categories */}
        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 border-b border-neutral-200 pb-2">
              <h2 className="text-lg font-medium text-neutral-900">
                Learning Goals
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={() => setSelectedGoalId(goal.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Category breakdown */}
            <div>
              <div className="mb-4 border-b border-neutral-200 pb-2">
                <h2 className="text-lg font-medium text-neutral-900">
                  Category Breakdown
                </h2>
              </div>

              <div className="space-y-4">
                {dashboard.category_breakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-1.5 flex justify-between text-sm font-medium">
                      <span className="text-neutral-700">{item.category}</span>
                      <span className="text-neutral-500">{item.hours || 0}h</span>
                    </div>
                    <div className="h-1.5 rounded-none bg-neutral-100">
                      <div
                        className="h-full rounded-none bg-neutral-900"
                        style={{ width: `${Math.min(Number(item.hours) * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="pt-4">
              <div className="mb-4 border-b border-neutral-200 pb-2">
                <h2 className="text-lg font-medium text-neutral-900">
                  Recent Activity
                </h2>
              </div>

              <div className="divide-y divide-neutral-100">
                {dashboard.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {activity.skill}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {activity.date}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                      {activity.hours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onCreated={loadData}
        />
      )}

      {selectedGoalId && (
        <GoalDetailsModal
          goalId={selectedGoalId}
          onClose={() => setSelectedGoalId(null)}
          onUpdated={loadData}
        />
      )}
    </main>
  );
}