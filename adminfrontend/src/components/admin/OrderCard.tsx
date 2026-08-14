import type { AdminOrder, OrderStatus } from "../../types/order";

type OrderCardProps = {
  order: AdminOrder;
};

function StatusIcon({ status }: { status: AdminOrder["status"] }) {
  switch (status) {
    case "RECEIVED":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* package / received */}
          <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="M4 7.5 12 12l8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );

    case "PREPARING":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* cooking */}
          <path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8Z" />
          <path d="M3 10h18" />
          <path d="M8 6c0-1.5 1-2 1-3" />
          <path d="M12 6c0-1.5 1-2 1-3" />
          <path d="M16 6c0-1.5 1-2 1-3" />
        </svg>
      );

    case "READY":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* check */}
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "OUT_FOR_DELIVERY":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {/* truck */}
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "DELIVERED":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m7.5 12 3 3 6-6" />
        </svg>
      );

    case "CANCELLED":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <StatusIcon status={order.status} />

        <span className="text-sm text-zinc-500">₹{order.total}</span>
      </div>

      <div className="mt-3">
        <p className="font-medium">{order.deliveryName}</p>

        <p className="text-sm text-zinc-500">#{order.id.slice(0, 8)}</p>

        <p className="mt-1 text-sm text-zinc-500">{order.items.length} items</p>
      </div>
    </div>
  );
}
