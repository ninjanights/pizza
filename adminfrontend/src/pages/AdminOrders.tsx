import { useEffect, useState } from "react";
import OrderCard from "../components/admin/OrderCard";
import { getAdminOrders } from "../services/admin.service";
import type { AdminOrder, OrderStatus } from "../types/order";

const statuses: (OrderStatus | "ALL")[] = [
  "ALL",
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminOrders(page, status);

        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [page, status]);

  function handleStatusChange(newStatus: OrderStatus | "ALL") {
    setStatus(newStatus);

    // Whenever filter changes, start from page 1
    setPage(1);
  }

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Orders
      </h1>

      {/* Status filters */}
      <div className="mb-6 flex gap-2">
        {statuses.map((item) => (
          <button
            key={item}
            onClick={() => handleStatusChange(item)}
            className={
              status === item
                ? "rounded-lg bg-zinc-900 px-4 py-2 text-white"
                : "rounded-lg bg-zinc-100 px-4 py-2 text-zinc-600"
            }
          >
            {item.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="text-zinc-500">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}