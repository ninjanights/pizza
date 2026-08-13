export interface CreateOrderItem {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  items: CreateOrderItem[];
}

export function validateCreateOrder(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return "Invalid request body";
  }

  const body = data as Partial<CreateOrderRequest>;

  if (!body.deliveryName?.trim()) {
    return "Delivery name is required";
  }

  if (!body.deliveryPhone?.trim()) {
    return "Delivery phone is required";
  }

  if (!body.deliveryAddress?.trim()) {
    return "Delivery address is required";
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return "Order must contain at least one item";
  }

  for (const item of body.items) {
    if (!item.menuItemId || typeof item.menuItemId !== "string") {
      return "Invalid menu item";
    }

    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      return "Quantity must be a positive integer";
    }
  }

  return null;
}