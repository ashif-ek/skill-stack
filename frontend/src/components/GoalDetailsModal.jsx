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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 transition-opacity">
        <div className="rounded-md bg-white p-6 shadow-xl ring-1 ring-neutral-200">
          <p className="text-neutral-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 transition-opacity">
        <div className="rounded-md bg-white p-6 shadow-xl ring-1 ring-neutral-200">
          <p className="text-red-500 font-medium">{error || "Goal not found."}</p>
          <button onClick={onClose} className="mt-4 text-neutral-900 font-medium hover:underline">Close</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 transition-opacity">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-neutral-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-neutral-200 p-6 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-neutral-900">{goal.skill_name}</h2>
                <span 
                  className={`rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    goal.status === "completed" ? "border-neutral-800 bg-neutral-800 text-white" :
                    goal.status === "in_progress" ? "border-neutral-300 bg-neutral-100 text-neutral-700" :
                    "border-neutral-200 bg-white text-neutral-500"
                  }`}
                >
                  {goal.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-neutral-500">
                {goal.category} &bull; {goal.platform} &bull; <span className="capitalize">{goal.difficulty}</span> &bull; {goal.resource_type}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
            
            {/* Meta & Actions */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-neutral-200 bg-white p-4">
                <p className="text-sm font-medium text-neutral-500">Progress</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden bg-neutral-100">
                    <div
                      className="h-full bg-neutral-900 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="font-bold text-neutral-900">{goal.progress}%</span>
                </div>
              </div>

              <div className="rounded-md border border-neutral-200 bg-white p-4 flex flex-col justify-center">
                <p className="text-sm font-medium text-neutral-500">Total Hours Logged</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">{goal.total_hours || 0}<span className="text-sm text-neutral-500 font-medium ml-1">hrs</span></p>
              </div>
            </div>

            {/* Notes */}
            {goal.notes && (
              <div className="mb-8">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Notes</h3>
                <div className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                  {goal.notes}
                </div>
              </div>
            )}

            {goal.resource_url && (
              <div className="mb-8">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Resource Link</h3>
                <a href={goal.resource_url} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline text-sm font-medium">
                  {goal.resource_url}
                </a>
              </div>
            )}

            {/* Activities */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Learning Sessions</h3>
                <button
                  onClick={() => setShowLogActivity(true)}
                  className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
                >
                  Log Activity
                </button>
              </div>

              {goal.activities && goal.activities.length > 0 ? (
                <div className="divide-y divide-neutral-100 rounded-md border border-neutral-200 bg-white">
                  {goal.activities.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <p className="font-medium text-neutral-900">{activity.date}</p>
                        {activity.notes && <p className="text-sm text-neutral-500 mt-0.5">{activity.notes}</p>}
                      </div>
                      <span className="font-semibold text-neutral-700 bg-neutral-100 rounded px-2 py-1 text-xs shrink-0 whitespace-nowrap">
                        {activity.hours} hrs
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
                  No learning sessions logged yet. Start tracking your time!
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between border-t border-neutral-200 bg-neutral-50 p-4 px-6">
            <button
              onClick={handleDelete}
              disabled={updating}
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 hover:underline disabled:opacity-50 mt-3 sm:mt-0"
            >
              Delete Goal
            </button>

            <div className="flex gap-2">
              {goal.status !== "completed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updating}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
                >
                  Mark Completed
                </button>
              )}
              {goal.status !== "in_progress" && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={updating}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
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
