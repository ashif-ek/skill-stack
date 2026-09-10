import { useEffect, useState } from "react";
import { getGoal, updateGoal, deleteGoal, getGoalInsight } from "../services/api";
import LogActivityModal from "./LogActivityModal";
import EditGoalModal from "./EditGoalModal";

export default function GoalDetailsModal({ goalId, onClose, onUpdated }) {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState("");

  useEffect(() => {
    loadGoalDetails();
  }, [goalId]);

  async function loadGoalDetails() {
    try {
      setLoading(true);
      const data = await getGoal(goalId);
      setGoal(data);
    } catch {
      setError("Unable to load goal details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      setUpdating(true);
      await updateGoal(goalId, { status: newStatus });
      await loadGoalDetails();
      onUpdated();
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this goal and all its activities?")) return;
    
    try {
      setUpdating(true);
      await deleteGoal(goalId);
      onUpdated();
      onClose();
    } catch {
      setError("Failed to delete goal.");
      setUpdating(false);
    }
  }

  async function handleLoadInsight() {
    try {
      setInsightLoading(true);
      setInsightError("");
      const data = await getGoalInsight(goalId);
      setInsight(data);
    } catch (err) {
      setInsightError(err.message || "Failed to load insight.");
    } finally {
      setInsightLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition-opacity">
        <div className="rounded-xl bg-white p-6 shadow-xl border border-slate-200">
          <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition-opacity">
        <div className="rounded-xl bg-white p-6 shadow-xl border border-slate-200">
          <p className="text-red-500 font-medium">{error || "Goal not found."}</p>
          <button onClick={onClose} className="mt-4 text-slate-900 font-medium hover:underline">Close</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition-opacity">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-4 bg-white">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{goal.skill_name}</h2>
                <span 
                  className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    goal.status === "completed" ? "border-slate-800 bg-slate-800 text-white" :
                    goal.status === "in_progress" ? "border-slate-300 bg-slate-50 text-slate-700 shadow-sm" :
                    "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {goal.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                {goal.category} &bull; {goal.platform} &bull; <span className="capitalize">{goal.difficulty}</span> &bull; {goal.resource_type}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            
            {/* Meta & Actions */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Progress</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900">{goal.progress}%</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-center shadow-sm">
                <p className="text-sm font-medium text-slate-500">Total Hours Logged</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{goal.total_hours || 0}<span className="text-sm text-slate-500 font-medium ml-1">hrs</span></p>
              </div>
            </div>

            {/* Notes */}
            {goal.notes && (
              <div className="mb-8">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</h3>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                  {goal.notes}
                </div>
              </div>
            )}

            {goal.resource_url && (
              <div className="mb-8">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Resource Link</h3>
                <a href={goal.resource_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                  {goal.resource_url}
                </a>
              </div>
            )}

            {/* AI Insight */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  AI Learning Insight
                </h3>
                {!insight && !insightLoading && (
                  <button
                    onClick={handleLoadInsight}
                    className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    Generate Insight
                  </button>
                )}
              </div>

              {insightLoading && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center animate-pulse">
                  <p className="text-sm font-medium text-slate-500">Analyzing your progress...</p>
                </div>
              )}

              {insightError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm flex items-start justify-between">
                  <p className="text-sm text-red-600">{insightError}</p>
                  <button onClick={handleLoadInsight} className="text-xs font-medium text-red-700 hover:underline">Retry</button>
                </div>
              )}

              {insight && !insightLoading && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Assessment</span>
                    <p className="text-sm text-slate-900 font-medium">{insight.assessment}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Next Step</span>
                      <p className="text-sm text-slate-700">{insight.next_step}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommended Focus</span>
                      <p className="text-sm text-slate-700">{insight.resource_recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activities */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Learning Sessions</h3>
                <button
                  onClick={() => setShowLogActivity(true)}
                  className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  Log Activity
                </button>
              </div>

              {goal.activities && goal.activities.length > 0 ? (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {goal.activities.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <p className="font-medium text-slate-900">{activity.date}</p>
                        {activity.notes && <p className="text-sm text-slate-500 mt-0.5">{activity.notes}</p>}
                      </div>
                      <span className="font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs shrink-0 whitespace-nowrap shadow-sm">
                        {activity.hours} hrs
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  No learning sessions logged yet. Start tracking your time!
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 px-6">
            <button
              onClick={handleDelete}
              disabled={updating}
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 hover:underline disabled:opacity-50 mt-3 sm:mt-0"
            >
              Delete Goal
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEditGoal(true)}
                disabled={updating}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
              >
                Edit Goal
              </button>
              {goal.status !== "completed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updating}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                >
                  Mark Completed
                </button>
              )}
              {goal.status !== "in_progress" && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={updating}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                >
                  Mark In Progress
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLogActivity && (
        <LogActivityModal
          goalId={goal.id}
          goalName={goal.skill_name}
          onClose={() => setShowLogActivity(false)}
          onLogged={() => {
            loadGoalDetails();
            onUpdated();
          }}
        />
      )}

      {showEditGoal && (
        <EditGoalModal
          goal={goal}
          onClose={() => setShowEditGoal(false)}
          onUpdated={() => {
            loadGoalDetails();
            onUpdated();
          }}
        />
      )}
    </>
  );
}
