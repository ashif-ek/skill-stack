import { useState } from "react";
import { logActivity } from "../services/api";

export default function LogActivityModal({ goalId, goalName, onClose, onLogged }) {
  const [form, setForm] = useState({
    goal: goalId,
    date: new Date().toISOString().split("T")[0],
    hours: 1,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "hours" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.hours <= 0) {
      setError("Hours must be greater than zero.");
      return;
    }

    try {
      setSaving(true);
      await logActivity(form);
      onLogged();
      onClose();
    } catch {
      setError("Could not log activity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/40 p-4 transition-opacity">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl ring-1 ring-neutral-200">
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Log Activity</h2>
            <p className="mt-1 text-sm font-medium text-neutral-500 line-clamp-1">
              For: {goalName}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Hours</label>
              <input
                type="number"
                name="hours"
                value={form.hours}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="What did you learn?"
              rows="3"
              className="w-full resize-none rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-8 flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? "Logging..." : "Log Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
