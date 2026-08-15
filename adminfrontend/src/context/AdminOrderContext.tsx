import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAdminAuth } from "./AdminAuthContext";

import {
  getAdminDashboard,
  getAdminOrders,
  updateOrderStatus,
  type AdminOrdersResponse,
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
  totalPages: number;

  loading: boolean;
  error: string;

  loadOrders: (page: number, status: OrderStatus | "ALL") => Promise<void>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
};

const AdminOrdersContext = createContext<OrdersContextType | undefined>(undefined);

const getOrdersCacheKey = (page: number, status: OrderStatus | "ALL") =>
  `${page}:${status}`;

export function AdminOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ordersCache = useRef(new Map<string, AdminOrdersResponse>());

  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    // Wait until auth is resolved before loading dashboard to avoid
    // making unauthenticated API requests on first page visit.
    if (authLoading) return;

    async function loadDashboard() {
      try {
        setError("");

        if (!isAuthenticated) {
          // Not authenticated: clear dashboard and stop loading
          setDashboard(null);
          setLoading(false);
          return;
        }

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
  }, [isAuthenticated, authLoading]);

  const loadOrders = useCallback(
    async (page: number, status: OrderStatus | "ALL") => {
      const cacheKey = getOrdersCacheKey(page, status);
      const cachedOrders = ordersCache.current.get(cacheKey);

      if (cachedOrders) {
        setOrders(cachedOrders.orders);
        setTotalPages(cachedOrders.pagination.totalPages);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminOrders(page, status);

        ordersCache.current.set(cacheKey, data);
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        ),
      );

      ordersCache.current.forEach((cachedOrders) => {
        cachedOrders.orders = cachedOrders.orders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        );
      });
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
        totalPages,
        loading,
        error,
        loadOrders,
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
