import { useEffect, useState } from "react";

import AddGoalModal from "../components/AddGoalModal";
import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import GoalDetailsModal from "../components/GoalDetailsModal";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { getDashboard, getGoals } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  async function loadData(isBackground = false) {
    try {
      if (!isBackground) setLoading(true);
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
      if (!isBackground) setLoading(false);
    }
  }

  useEffect(() => {
    loadData(false);
  }, []);

  if (loading && !dashboard) {
    return <DashboardSkeleton />;
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
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Learning Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Build skills. Track progress. Keep moving.
            </p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Goal
          </button>
        </header>

        {/* Main 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Goals */}
          <div className="lg:col-span-8 space-y-6">
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
                    onClick={() => setSelectedGoalId(goal.id)}
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
          </div>

          {/* RIGHT COLUMN: Insights / Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Card */}
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

            {/* Learning Pulse */}
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

            {/* Category Breakdown */}
            {dashboard.category_breakdown.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">Where your time is going</h2>
                </div>
                <div className="p-4 space-y-4">
                  {dashboard.category_breakdown.map((item) => (
                    <div key={item.category}>
                      <div className="mb-1 flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{item.category}</span>
                        <span className="text-slate-500">{item.hours || 0}h</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-400"
                          style={{ width: `${Math.min(Number(item.hours) * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {dashboard.recent_activity.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-900">Your learning trail</h2>
                </div>
                <div className="divide-y divide-slate-100 p-4">
                  {dashboard.recent_activity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="truncate text-xs font-medium text-slate-900">
                          {activity.skill}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {activity.date}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
                        {activity.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onCreated={() => loadData(true)}
        />
      )}

      {selectedGoalId && (
        <GoalDetailsModal
          goalId={selectedGoalId}
          onClose={() => setSelectedGoalId(null)}
          onUpdated={() => loadData(true)}
        />
      )}
    </main>
  );
}