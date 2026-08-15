import { memo } from "react";
import type { AdminOrder, OrderStatus } from "../../types/order";
import { useAdminOrders } from "../../context/AdminOrderContext";
import { OrderStatusIcon, statusInfo } from "./orderStatusMeta";

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

const stepCircleClass = "flex h-9 w-9 items-center justify-center rounded-full transition";
const mutedTextClass = "text-[12px] font-bold text-neutral-500";
const detailLabelClass = "text-[12px] font-black uppercase tracking-wide text-neutral-500";
const detailPanelClass = "rounded-lg bg-neutral-300 p-4";

function OrderCard({ order }: OrderCardProps) {
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-lg font-black text-neutral-900">#{order.id.slice(0, 8)}</p>
          <p className={`mt-1 truncate ${mutedTextClass}`}>{order.deliveryName}</p>
        </div>

        <p className="shrink-0 text-3xl font-black pr-1 text-[#5DD3B6]">
          {Number(order.total).toFixed(2)}
          <span className="text-[12px] text-neutral-600"> INR</span>
        </p>
      </div>

      <div className="mt-5">
        {order.status === "CANCELLED" ? (
          <div className="flex items-center gap-3 text-red-500">
            <div className={`${stepCircleClass} orders-status-cancelled text-red-600`}>
              <OrderStatusIcon status="CANCELLED" />
            </div>
            <span className="font-black text-neutral-900">Cancelled</span>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1">
            {statuses.map((status, index) => {
              const isActive = status === order.status;
              const isCompleted = currentIndex >= index;
              const isLast = index === statuses.length - 1;

              return (
                <div key={status} className="relative flex min-w-0 flex-col items-center">
                  {!isLast && (
                    <div
                      className={`absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[18px] h-[2px] ${
                        currentIndex > index
                          ? "orders-step-line-active"
                          : "orders-step-line-idle"
                      }`}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className="group relative flex min-w-0 flex-col items-center gap-2 text-center"
                  >
                    <div
                      className={`${stepCircleClass} ${
                        isCompleted
                          ? "orders-step-active text-neutral-900"
                          : "orders-step-idle text-zinc-400"
                      }`}
                    >
                      <OrderStatusIcon status={status} className="h-5 w-5" />
                    </div>

                    <span
                      className={`w-full text-[11px] font-bold leading-3 transition ${
                        isActive
                          ? "text-[#ED7B7B]"
                          : isCompleted
                            ? "text-neutral-700"
                            : "text-zinc-400"
                      } group-hover:text-[#ED7B7B]`}
                    >
                      {statusInfo[status].label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className={detailPanelClass}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className={detailLabelClass}>Items</p>
            <span className="text-[12px] font-black text-neutral-600">
              {order.items.length} total
            </span>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
                <span className="min-w-0 truncate font-bold text-neutral-700">
                  {item.menuItem.name} × {item.quantity}
                </span>
                <span className="text-right font-black text-neutral-900">
                  ₹{Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={detailPanelClass}>
          <p className={detailLabelClass}>Delivery Details</p>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="grid grid-cols-[76px_1fr] gap-3">
              <span className="font-bold text-neutral-500">Name</span>
              <span className="font-black text-neutral-900">{order.deliveryName}</span>
            </div>
            <div className="grid grid-cols-[76px_1fr] gap-3">
              <span className="font-bold text-neutral-500">Phone</span>
              <span className="font-black text-neutral-900">{order.deliveryPhone}</span>
            </div>
            <div className="grid grid-cols-[76px_1fr] gap-3">
              <span className="font-bold text-neutral-500">Address</span>
              <span className="font-black leading-5 text-neutral-900">{order.deliveryAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(OrderCard);
