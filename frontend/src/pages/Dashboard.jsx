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
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              SkillStack
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Learning Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Track your progress and build better learning habits.
            </p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
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
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Learning Pulse
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-full ${
                  pulse.momentum === 'Strong' ? 'bg-green-500' :
                  pulse.momentum === 'Good' ? 'bg-blue-500' :
                  'bg-orange-500'
                }`}></span>
                {pulse.momentum} momentum
              </h2>
            </div>

            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200">
                Last 7 days
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100/50">
              <p className="text-sm font-medium text-blue-800">
                Learning time
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {pulse.weekly_hours} <span className="text-lg font-medium text-blue-700">hours</span>
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4 ring-1 ring-green-100/50">
              <p className="text-sm font-medium text-green-800">
                Active days
              </p>
              <p className="mt-2 text-3xl font-bold text-green-900">
                {pulse.active_days}<span className="text-lg font-medium text-green-700">/7</span>
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4 ring-1 ring-purple-100/50">
              <p className="text-sm font-medium text-purple-800">
                Average progress
              </p>
              <p className="mt-2 text-3xl font-bold text-purple-900">
                {pulse.average_progress}<span className="text-lg font-medium text-purple-700">%</span>
              </p>
            </div>
          </div>
        </section>

        {/* Goals + Categories */}
        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
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
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-bold text-gray-900">
                Category Breakdown
              </h2>

              <div className="mt-6 space-y-5">
                {dashboard.category_breakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-1.5 flex justify-between text-sm font-medium">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="text-gray-500">{item.hours || 0}h</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 shadow-inner">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.min(Number(item.hours) * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>

              <div className="mt-5 divide-y divide-gray-100">
                {dashboard.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {activity.skill}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {activity.date}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
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