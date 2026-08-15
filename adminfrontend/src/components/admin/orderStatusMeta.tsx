import { CheckCircle2, ChefHat, CircleX, Package, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OrderStatus } from "../../types/order";

export const statusInfo: Record<OrderStatus, { label: string; Icon: LucideIcon }> = {
  RECEIVED: {
    label: "Received",
    Icon: Package,
  },
  PREPARING: {
    label: "Preparing",
    Icon: ChefHat,
  },
  READY: {
    label: "Ready",
    Icon: CheckCircle2,
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    Icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    Icon: CircleX,
  },
};

type OrderStatusIconProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusIcon({
  status,
  className = "h-6 w-6",
}: OrderStatusIconProps) {
  const Icon = statusInfo[status].Icon;

  return <Icon className={className} strokeWidth={1.8} />;
}
