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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Add Learning Goal</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add something you want to learn.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="skill_name"
            value={form.skill_name}
            onChange={handleChange}
            placeholder="Skill name"
            required
            className="w-full rounded-lg border px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="rounded-lg border px-3 py-2"
            />

            <input
              name="platform"
              value={form.platform}
              onChange={handleChange}
              placeholder="Platform"
              required
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              name="resource_type"
              value={form.resource_type}
              onChange={handleChange}
              className="rounded-lg border px-3 py-2"
            >
              <option value="course">Course</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
            </select>

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="rounded-lg border px-3 py-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <input
            name="resource_url"
            value={form.resource_url}
            onChange={handleChange}
            placeholder="Resource URL (optional)"
            className="w-full rounded-lg border px-3 py-2"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            rows="3"
            className="w-full rounded-lg border px-3 py-2"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}