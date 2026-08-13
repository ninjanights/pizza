import type { AdminOrder, OrderStatus } from "../types/order";
const API_URL = "http://localhost:8000/api";

export async function adminLogin(
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}



export async function getAdminOrders(): Promise<AdminOrder[]>{
  const response = await fetch(`${API_URL}/admin/orders`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.data;
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<AdminOrder> {
  const response = await fetch(
    `${API_URL}/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order");
  }

  return data.data;
}