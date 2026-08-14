import { useSearchParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import OrderCard from "../components/admin/OrderStripCard";
import type { OrderStatus } from "../types/order";

const statuses: OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function Orders() {
  const { orders, loading, error } = useOrders();

  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get("status") as OrderStatus | null;

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredOrders = currentStatus
    ? orders.filter((order) => order.status === currentStatus)
    : orders;

  function handleFilterChange(status: string) {
    if (status === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage and monitor all orders
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={currentStatus ?? "ALL"}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2"
        >
          <option value="ALL">All Orders</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <p className="text-zinc-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderStripCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* paginate in future */}


    </div>
  );
}
