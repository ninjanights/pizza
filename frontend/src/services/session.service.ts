// services/session.service.ts

const API_URL = "http://localhost:8000/api";

export async function initializeCustomerSession() {
  const response = await fetch(`${API_URL}/session`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to initialize session"
    );
  }

  return data.data;
}