import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getOrdersCustomer,
  cancelOrderCustomer,
} from "../services/order.service";

import type { AdminOrder, OrderStatus } from "../types/order";

type CustomerOrdersContextType = {
  orders: AdminOrder[];
  loading: boolean;
  error: string;

  cancelOrder: (orderId: string) => Promise<void>;
};

const CustomerOrdersContext = createContext<
  CustomerOrdersContextType | undefined
>(undefined);

export function CustomerOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrdersCustomer();

      setOrders(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function cancelOrder(orderId: string) {
    try {
      await cancelOrderCustomer(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "CANCELLED" as OrderStatus,
              }
            : order,
        ),
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to cancel order",
      );
    }
  }

  return (
    <CustomerOrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        cancelOrder,
      }}
    >
      {children}
    </CustomerOrdersContext.Provider>
  );
}

export function useCustomerOrders() {
  const context = useContext(CustomerOrdersContext);

  if (!context) {
    throw new Error(
      "useCustomerOrders must be used inside CustomerOrdersProvider",
    );
  }

  return context;
}
