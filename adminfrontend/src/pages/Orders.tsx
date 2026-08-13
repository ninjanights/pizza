import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../services/admin.service";
import type { AdminOrder, OrderStatus } from "../types/order";

const statuses: OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAdminOrders();
        setOrders(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  async function handleStatusChange(
    orderId: string,
    status: OrderStatus
  ) {
    try {
      const updatedOrder = await updateOrderStatus(
        orderId,
        status
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order"
      );
    }
  }

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h2>Order #{order.id}</h2>

            <p>
              Customer: {order.deliveryName}
            </p>

            <p>
              Phone: {order.deliveryPhone}
            </p>

            <p>
              Address: {order.deliveryAddress}
            </p>

            <p>
              Total: ₹{order.total}
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(
                  order.id,
                  e.target.value as OrderStatus
                )
              }
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <div>
              {order.items.map((item) => (
                <p key={item.id}>
                  {item.menuItem.name} × {item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}