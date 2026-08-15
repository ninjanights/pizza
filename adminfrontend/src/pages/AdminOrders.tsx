import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrderCard from "../components/admin/OrderCard";
import { useAdminOrders } from "../context/AdminOrderContext";
import type { OrderStatus } from "../types/order";

const statuses: (OrderStatus | "ALL")[] = [
  "ALL",
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const pageHeaderClass = "mb-6 flex items-center gap-4 px-8";
const headerTextClass = "max-w-xl text-[12px] font-medium leading-6 text-neutral-700";
const filterButtonClass = "rounded-lg px-4 py-2 text-sm font-black";

function getValidStatus(value: string | null): OrderStatus | "ALL" {
  return statuses.includes(value as OrderStatus | "ALL")
    ? (value as OrderStatus | "ALL")
    : "ALL";
}

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, totalPages, loading, error, loadOrders } = useAdminOrders();
  const [status, setStatus] = useState<OrderStatus | "ALL">(() =>
    getValidStatus(searchParams.get("status")),
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    const urlStatus = getValidStatus(searchParams.get("status"));

    setStatus(urlStatus);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    loadOrders(page, status);
  }, [loadOrders, page, status]);

  const orderCards = useMemo(
    () => orders.map((order) => <OrderCard key={order.id} order={order} />),
    [orders],
  );

  function handleStatusChange(newStatus: OrderStatus | "ALL") {
    setStatus(newStatus);
    setPage(1);

    if (newStatus === "ALL") {
      setSearchParams({});
      return;
    }

    setSearchParams({ status: newStatus });
  }

  if (loading) {
    return <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6"><p className="text-xl font-black text-neutral-500">Loading orders...</p></main>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-6">
      <div className={pageHeaderClass}>
        <h1 className="text-2xl font-black">Orders</h1>
        <div className="h-12 w-[1px] bg-neutral-400"></div>
        <p className={headerTextClass}>
          Every order has its own small weather system. Nudge the status forward
          and keep the kitchen sky clear.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button
            key={item}
            onClick={() => handleStatusChange(item)}
            className={
              status === item
                ? `orders-accent-button ${filterButtonClass} text-neutral-900`
                : `orders-filter-button ${filterButtonClass} text-neutral-600`
            }
          >
            {item.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {orders.length === 0 ? (
          <p className="col-span-full flex min-h-[50vh] items-center justify-center text-xl font-black text-neutral-500">No orders found.</p>
        ) : (
          orderCards
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="orders-filter-button rounded-lg px-4 py-2 font-black text-neutral-700 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm font-bold text-neutral-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="orders-filter-button rounded-lg px-4 py-2 font-black text-neutral-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
