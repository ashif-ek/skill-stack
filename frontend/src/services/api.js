const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard/`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
}

export async function getGoals() {
  const response = await fetch(`${API_URL}/goals/`);

  if (!response.ok) {
    throw new Error("Failed to load goals");
  }

  return response.json();
}

export async function createGoal(goal) {
  const response = await fetch(`${API_URL}/goals/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    throw new Error("Failed to create goal");
  }

  return response.json();
}