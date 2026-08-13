import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../services/admin.service";

type Order = {
  id: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  total: number;
  status: string;
  createdAt: string;
};

const statuses = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const response = await getAdminOrders();

      setOrders(response);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {error && <p>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h2>Order #{order.id}</h2>

              <p>Customer: {order.deliveryName}</p>

              <p>Phone: {order.deliveryPhone}</p>

              <p>Address: {order.deliveryAddress}</p>

              <p>Total: ₹{order.total}</p>

              <p>Status: {order.status}</p>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
