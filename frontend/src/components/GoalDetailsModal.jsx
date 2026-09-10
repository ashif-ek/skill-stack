import { useEffect, useState } from "react";
import { getGoal, updateGoal, deleteGoal } from "../services/api";
import LogActivityModal from "./LogActivityModal";

export default function GoalDetailsModal({ goalId, onClose, onUpdated }) {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <p className="text-gray-500">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <p className="text-red-500">{error || "Goal not found."}</p>
          <button onClick={onClose} className="mt-4 text-blue-600">Close</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm transition-opacity">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 p-6 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{goal.skill_name}</h2>
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
              <p className="mt-1.5 text-sm font-medium text-gray-500">
                {goal.category} &bull; {goal.platform} &bull; <span className="capitalize">{goal.difficulty}</span> &bull; {goal.resource_type}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Meta & Actions */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-900">{goal.progress}%</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500">Total Hours Logged</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{goal.total_hours || 0}<span className="text-sm text-gray-500 font-medium ml-1">hrs</span></p>
              </div>
            </div>

            {/* Notes */}
            {goal.notes && (
              <div className="mb-8">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Notes</h3>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  {goal.notes}
                </div>
              </div>
            )}

            {goal.resource_url && (
              <div className="mb-8">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Resource Link</h3>
                <a href={goal.resource_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                  {goal.resource_url}
                </a>
              </div>
            )}

            {/* Activities */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Learning Sessions</h3>
                <button
                  onClick={() => setShowLogActivity(true)}
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                >
                  + Log Activity
                </button>
              </div>

              {goal.activities && goal.activities.length > 0 ? (
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
                  {goal.activities.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <p className="font-medium text-gray-900">{activity.date}</p>
                        {activity.notes && <p className="text-sm text-gray-500 mt-0.5">{activity.notes}</p>}
                      </div>
                      <span className="font-semibold text-gray-700 bg-gray-100 rounded-md px-2.5 py-1 text-sm shrink-0 whitespace-nowrap">
                        {activity.hours} hrs
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  No learning sessions logged yet. Start tracking your time!
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between border-t border-gray-100 bg-gray-50 p-4 px-6">
            <button
              onClick={handleDelete}
              disabled={updating}
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 disabled:opacity-50 mt-3 sm:mt-0"
            >
              Delete Goal
            </button>

            <div className="flex gap-2">
              {goal.status !== "completed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updating}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Mark Completed
                </button>
              )}
              {goal.status !== "in_progress" && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={updating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
    </>
  );
}
