import type { StatusStats } from "../../context/AdminOrderContext";
import type { OrderStatus } from "../../types/order";

type OrderStatusCardProps = {
  data: StatusStats
};

const statusInfo: Record<
  OrderStatus,
  {
    label: string;
    icon: string;
  }
> = {
  RECEIVED: {
    label: "Received",
    icon: "📦",
  },
  PREPARING: {
    label: "Preparing",
    icon: "🍳",
  },
  READY: {
    label: "Ready",
    icon: "✓",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: "🚚",
  },
  DELIVERED: {
    label: "Delivered",
    icon: "✓",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: "✕",
  },
};

export default function OrderStatusCard({
  data
}: OrderStatusCardProps) {
  const info = statusInfo[data.status];
 return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl">
          {info.icon}
        </div>

        <span className="text-sm text-zinc-500">
          {data.orderCount}{" "}
          {data.orderCount === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Status */}
      <h2 className="mt-4 text-lg font-semibold text-zinc-900">
        {info.label}
      </h2>

      {/* Revenue */}
      <p className="mt-2 text-2xl font-bold text-zinc-900">
        ₹{data.revenue.toLocaleString("en-IN")}
      </p>

      <p className="text-xs text-zinc-500">
        Total order value
      </p>

      {/* Details */}
      <div className="mt-5 space-y-3 border-t border-zinc-100 pt-4">

        <div>
          <p className="text-xs text-zinc-500">
            Most ordered place
          </p>

          <p className="text-sm font-medium text-zinc-900">
            {data.mostOrderedPlace
              ? data.mostOrderedPlace.address
              : "-"}
          </p>

          {data.mostOrderedPlace && (
            <p className="text-xs text-zinc-500">
              {data.mostOrderedPlace.orderCount} orders
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            Most ordered customer
          </p>

          <p className="text-sm font-medium text-zinc-900">
            {data.mostOrderedCustomer
              ? data.mostOrderedCustomer.name
              : "-"}
          </p>

          {data.mostOrderedCustomer && (
            <p className="text-xs text-zinc-500">
              {data.mostOrderedCustomer.orderCount} orders
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            Most ordered item
          </p>

          <p className="text-sm font-medium text-zinc-900">
            {data.mostOrderedItem
              ? data.mostOrderedItem.name
              : "-"}
          </p>

          {data.mostOrderedItem && (
            <p className="text-xs text-zinc-500">
              {data.mostOrderedItem.quantity} ordered
            </p>
          )}
        </div>

      </div>
    </div>
  );
}