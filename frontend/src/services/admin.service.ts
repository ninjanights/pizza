import type { AdminOrder, OrderStatus } from "../types/order";
const API_URL = "http://localhost:8000/api";

export type AdminOrdersResponse = {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DashboardStatus = {
  status: OrderStatus;
  orderCount: number;
  revenue: number;
};

export type AdminDashboardData = {
  statuses: DashboardStatus[];
  totalOrders: number;
  totalRevenue: number;
  mostOrderedPlace: {
    address: string;
    orderCount: number;
  } | null;
  mostOrderedItem: {
    name: string;
    quantity: number;
  } | null;
};
export async function getAdminOrders(
  page = 1,
  status: OrderStatus | "ALL" = "ALL",
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
  });

  if (status !== "ALL") {
    params.set("status", status);
  }

  const response = await fetch(`${API_URL}/admin/orders?${params.toString()}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.data;
}
export async function adminLogin(email: string, password: string) {
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

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<AdminOrder> {
  const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order");
  }

  return data.data;
}

export async function getAdminDashboard() {
  const response = await fetch(`${API_URL}/admin/orders/dashboard`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard");
  }

  return data.data;
}


export async function adminLogout() {
  const response = await fetch(`${API_URL}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
}
