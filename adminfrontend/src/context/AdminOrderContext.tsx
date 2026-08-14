import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getAdminDashboard,
  updateOrderStatus,
} from "../services/admin.service";

import type { AdminOrder, OrderStatus } from "../types/order";

export type StatusStats = {
  status: OrderStatus;
  orderCount: number;
  revenue: number;

  mostOrderedPlace: {
    address: string;
    orderCount: number;
  } | null;

  mostOrderedCustomer: {
    name: string;
    orderCount: number;
  } | null;

  mostOrderedItem: {
    name: string;
    quantity: number;
  } | null;
};

type DashboardStats = {
  statuses: StatusStats[];
};

type OrdersContextType = {
  orders: AdminOrder[];
  dashboard: DashboardStats | null;

  loading: boolean;
  error: string;

  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
};

const AdminOrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function AdminOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const data = await getAdminDashboard();

        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        ),
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update order",
      );
    }
  }

  return (
    <AdminOrdersContext.Provider
      value={{
        orders,
        dashboard,
        loading,
        error,
        updateStatus,
      }}
    >
      {children}
    </AdminOrdersContext.Provider>
  );
}

export function useAdminOrders() {
  const context = useContext(AdminOrdersContext);

  if (!context) {
    throw new Error("useAdminOrders must be used inside OrdersProvider");
  }

  return context;
}
