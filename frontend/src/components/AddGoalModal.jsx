import { useState } from "react";
import { createGoal } from "../services/api";

const initialForm = {
  skill_name: "",
  category: "",
  resource_type: "course",
  platform: "",
  resource_url: "",
  status: "started",
  progress: 0,
  difficulty: "medium",
  notes: "",
};

export default function AddGoalModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);

      await createGoal(form);

      onCreated();
      onClose();
    } catch {
      setError("Could not create the learning goal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 transition-opacity">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl ring-1 ring-neutral-200">
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Add Learning Goal</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Set a new goal and start tracking your progress.
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Skill Name</label>
            <input
              name="skill_name"
              value={form.skill_name}
              onChange={handleChange}
              placeholder="e.g. Advanced React Patterns"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Frontend"
                required
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Platform</label>
              <input
                name="platform"
                value={form.platform}
                onChange={handleChange}
                placeholder="e.g. Frontend Masters"
                required
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Resource Type</label>
              <select
                name="resource_type"
                value={form.resource_type}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="course">Course</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Resource URL (Optional)</label>
            <input
              name="resource_url"
              value={form.resource_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any context or goals..."
              rows="3"
              className="w-full resize-none rounded-md border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

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
              {saving ? "Saving..." : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}