import type { AdminOrder } from "../types/order";

const API_URL = "http://localhost:8000/api";

export type CreateOrderRequest = {
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
};
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data;
}
export async function createOrderCustomer(data: CreateOrderRequest) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create order");
  }

  return result.data;
}

// GET ALL ORDERS FOR CURRENT SESSION - as Customers
export async function getOrdersCustomer() {
  return handleResponse<AdminOrder[]>(
    await fetch(`${API_URL}/orders`, {
      method: "GET",
      credentials: "include",
    }),
  );
}

// GET SINGLE ORDER
export async function getOrderByIdCustomer(orderId: string) {
  return handleResponse<AdminOrder>(
    await fetch(`${API_URL}/orders/${orderId}`, {
      method: "GET",
      credentials: "include",
    }),
  );
}

// CANCEL ORDER
export async function cancelOrderCustomer(orderId: string) {
  return handleResponse<{
    orderId: string;
    status: string;
  }>(
    await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: "PATCH",
      credentials: "include",
    }),
  );
}
