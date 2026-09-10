import { useEffect, useState } from "react";

import AddGoalModal from "../components/AddGoalModal";
import GoalDetailsModal from "../components/GoalDetailsModal";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Footer from "../components/Footer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSummary from "../components/DashboardSummary";
import LearningPulse from "../components/LearningPulse";
import GoalsSection from "../components/GoalsSection";
import CategoryBreakdown from "../components/CategoryBreakdown";
import RecentActivity from "../components/RecentActivity";
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
        
        <DashboardHeader onAddGoal={() => setShowAddGoal(true)} />

        {/* Main 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Goals */}
          <div className="lg:col-span-8 space-y-6">
            <GoalsSection goals={goals} onSelectGoal={setSelectedGoalId} />
          </div>

          {/* RIGHT COLUMN: Insights / Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <DashboardSummary stats={stats} />
            <LearningPulse pulse={pulse} />
            <CategoryBreakdown breakdown={dashboard.category_breakdown} />
            <RecentActivity activities={dashboard.recent_activity} />
          </div>
        </div>

        <Footer />
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