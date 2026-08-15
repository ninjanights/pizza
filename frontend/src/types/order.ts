export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  menuItem: {
    name: string;
  };
}

export interface AdminOrder {
  id: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}