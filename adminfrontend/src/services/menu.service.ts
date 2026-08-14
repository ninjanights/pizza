const API_URL = "http://localhost:8000/api";

export async function getMenuItems() {
  const response = await fetch(`${API_URL}/menu`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch menu");
  }

  return data.data;
}