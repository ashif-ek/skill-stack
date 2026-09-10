import { useEffect, useState } from "react";

import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import { getDashboard, getGoals } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            SkillStack
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Personal Learning Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Track your progress and build better learning habits.
          </p>
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

        {/* Goals + Categories */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Learning Goals
              </h2>

              <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                + Add Goal
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Category Breakdown</h2>

            <div className="mt-5 space-y-4">
              {dashboard.category_breakdown.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="text-gray-500">
                      {item.hours || 0}h
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{
                        width: `${Math.min(
                          Number(item.hours) * 5,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Recent Activity</h2>

          <div className="mt-4 divide-y">
            {dashboard.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium">{activity.skill}</p>
                  <p className="text-sm text-gray-500">
                    {activity.date}
                  </p>
                </div>

                <span className="font-medium">
                  {activity.hours}h
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}