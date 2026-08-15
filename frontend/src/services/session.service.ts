// services/session.service.ts

import { API_URL } from './api';

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