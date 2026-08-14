import type { AdminOrder, OrderStatus } from "../../types/order";
import { useAdminOrders } from "../../context/AdminOrderContext";

type OrderCardProps = {
  order: AdminOrder;
};

const statuses: OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const statusLabels: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function StatusIcon({ status }: { status: OrderStatus }) {
  switch (status) {
    case "RECEIVED":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="M4 7.5 12 12l8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );

    case "PREPARING":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
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
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "OUT_FOR_DELIVERY":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
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
          className="h-6 w-6"
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
          className="h-6 w-6"
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
  const { updateStatus } = useAdminOrders();

  const currentIndex = statuses.indexOf(order.status);

  async function handleStatusChange(status: OrderStatus) {
    if (status === order.status) return;

    try {
      await updateStatus(order.id, status);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="orders-card rounded-xl p-5">
      {/* Order header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-neutral-900">
            #{order.id.slice(0, 8)}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {order.deliveryName}
          </p>
        </div>

        <p className="text-4xl font-black text-[#769898]">
          {Number(order.total).toFixed(2)}<span className="text-[12px] text-neutral-600">INR</span>
        </p>
      </div>

      {/* Status Stepper */}
      <div className="mt-6">
        {order.status === "CANCELLED" ? (
          <div className="flex items-center gap-3 text-red-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500">
              <StatusIcon status="CANCELLED" />
            </div>

            <span className="font-black text-neutral-900">
              Cancelled
            </span>
          </div>
        ) : (
          <div>
            {statuses.map((status, index) => {
              const isActive = status === order.status;
              const isCompleted =
                currentIndex >= index;

              const isLast =
                index === statuses.length - 1;

              return (
                <div key={status}>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(status)
                    }
                    className="group flex w-full items-center text-left"
                  >
                    {/* Circle */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        isCompleted
                          ? "border-[#D99B77] bg-[#D99B77] text-neutral-900"
                          : "border-zinc-300 bg-white text-zinc-400"
                      }`}
                    >
                      <StatusIcon status={status} />
                    </div>

                    {/* Label */}
                    <span
                      className={`ml-3 text-sm transition ${
                        isActive
                          ? "font-black text-[#D99B77]"
                          : isCompleted
                            ? "font-medium text-zinc-700"
                            : "text-zinc-400"
                      } group-hover:text-[#D99B77]`}
                    >
                      {statusLabels[status]}
                    </span>
                  </button>

                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className={`ml-[17px] h-8 w-[2px] ${
                        currentIndex > index
                          ? "bg-[#D99B77]"
                          : "bg-zinc-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mt-6 border-t border-zinc-100 pt-4">
        <p className="mb-3 text-sm font-medium">
          {order.items.length} items
        </p>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span className="text-zinc-600">
                {item.menuItem.name} × {item.quantity}
              </span>

              <span>
                ₹{Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="mt-4 border-t border-zinc-100 pt-4">
        <p className="text-sm font-medium">
          Delivery
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {order.deliveryAddress}
        </p>

        <p className="text-sm text-zinc-500">
          {order.deliveryPhone}
        </p>
      </div>
    </div>
  );
}