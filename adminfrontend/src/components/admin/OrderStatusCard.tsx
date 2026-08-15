import { OrderStatusIcon, statusInfo } from "./orderStatusMeta";
import type { StatusStats } from "../../context/AdminOrderContext";

type OrderStatusCardProps = {
  data: StatusStats;
  onClick?: () => void;
};

const labelClass = "text-xs font-medium text-neutral-600";
const valueClass = "mt-1 text-sm font-bold text-neutral-900";

export default function OrderStatusCard({ data, onClick }: OrderStatusCardProps) {
  const info = statusInfo[data.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className="orders-card w-full rounded-xl p-5 text-left transition hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-300 text-neutral-900">
          <OrderStatusIcon status={data.status} />
        </div>

        <span className="rounded-full bg-neutral-300 px-3 py-1 text-sm font-black text-neutral-700">
          {data.orderCount} {data.orderCount === 1 ? "order" : "orders"}
        </span>
      </div>

      <h2 className="mt-4 text-lg font-black text-neutral-900">
        {info.label}
      </h2>

      <p className="mt-2 text-4xl font-black text-[#5DD3B6]">
        ₹{data.revenue.toLocaleString("en-IN")}
      </p>

      <p className={labelClass}>Total order value</p>

      <div className="mt-5 space-y-4 pt-4">
        <div>
          <p className={labelClass}>Most ordered place</p>
          <p className={valueClass}>
            {data.mostOrderedPlace ? data.mostOrderedPlace.address : "-"}
          </p>
          {data.mostOrderedPlace && (
            <p className={labelClass}>{data.mostOrderedPlace.orderCount} orders</p>
          )}
        </div>

        <div>
          <p className={labelClass}>Most ordered customer</p>
          <p className={valueClass}>
            {data.mostOrderedCustomer ? data.mostOrderedCustomer.name : "-"}
          </p>
          {data.mostOrderedCustomer && (
            <p className={labelClass}>{data.mostOrderedCustomer.orderCount} orders</p>
          )}
        </div>

        <div>
          <p className={labelClass}>Most ordered item</p>
          <p className={valueClass}>
            {data.mostOrderedItem ? data.mostOrderedItem.name : "-"}
          </p>
          {data.mostOrderedItem && (
            <p className={labelClass}>{data.mostOrderedItem.quantity} ordered</p>
          )}
        </div>
      </div>
    </button>
  );
}
