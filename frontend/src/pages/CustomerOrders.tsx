import { Clock, MapPin, Phone, ShoppingCart, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerOrders } from "../context/CustomerOrdersContext";
import type { OrderStatus } from "../types/order";
import { OrderStatusIcon } from "../components/admin/orderStatusMeta";

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "RECEIVED":
      return "Received";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "OUT_FOR_DELIVERY":
      return "Out for delivery";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

function CustomerOrders() {
  const navigate = useNavigate();
  const { orders, loading, error, cancelOrder } = useCustomerOrders();

  const statuses: OrderStatus[] = [
    "RECEIVED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <p className="text-xl font-black text-neutral-500">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-xl font-black text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="p-6">
        <div className="mb-6 px-[32px] flex items-center gap-4">
          <h1 className="text-2xl font-black">Orders</h1>
          <div className="h-12 w-[1px] bg-neutral-400"></div>
          <p className="max-w-xl text-[12px] font-medium leading-6 text-neutral-700">
            No paper trail yet, no midnight legend on the way.
            Pick a dish and your first order will bloom right here.
          </p>
        </div>

        <div className=" mx-auto flex max-w-md flex-col items-center rounded-xl p-8 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 stroke-[#ED7B7B]" />
          <h2 className="text-xl font-black text-neutral-800">No orders yet</h2>
          <p className="mt-2 text-[12px] font-bold text-neutral-500">
            Your orders will appear here after you place one.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="orders-accent-button mt-5 rounded-lg px-6 py-3 font-black text-neutral-900"
          >
            Browse Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6 px-[32px] flex items-center gap-4">
        <h1 className="text-2xl font-black">Orders</h1>
        <div className="h-12 w-[1px] bg-neutral-400"></div>
        <p className="max-w-xl text-[12px] font-medium leading-6 text-neutral-700">
          Your little food stories are stacked here, warm and trackable.
          Watch the kitchen, the road, and the doorstep all become one line.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {orders.map((order) => {
          const currentIndex = statuses.indexOf(order.status);

          return (
            <div key={order.id} className="orders-card  rounded-xl 
            relative">
                {order.status === "RECEIVED" && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="absolute top-3 right-3 flex items-center justify-center rounded-md p-2 text-red-600"
                    aria-label="Cancel Order"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={3} />
                  </button>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-black text-neutral-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="mt-1 text-[12px] font-bold text-neutral-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="grid grid-cols-5 gap-1">
                      {statuses.map((status, index) => {
                        const isActive = status === order.status;
                        const isCompleted = currentIndex >= index;
                        const isLast = index === statuses.length - 1;

                        return (
                          <div key={status} className="relative flex min-w-0 flex-col items-center text-center">
                            {!isLast && (
                              <div
                                className={`absolute left-[calc(50%+12px)] right-[calc(-50%+12px)] top-[14px] h-[2px] ${
                                  currentIndex > index ? "orders-step-line-active" : "orders-step-line-idle"
                                }`}
                              />
                            )}

                            <div className={`${isCompleted ? "orders-step-active text-neutral-900" : "orders-step-idle text-zinc-400"} flex h-7 w-7 items-center justify-center rounded-full`}> 
                              <OrderStatusIcon status={status} className="h-4 w-4" />
                            </div>

                            <span className={`mt-1 w-full text-[10px] font-bold transition ${isActive ? "text-[#ED7B7B]" : isCompleted ? "text-neutral-700" : "text-zinc-400"}`}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-neutral-900">{item.menuItem.name}</p>
                      <p className="text-[12px] font-bold text-neutral-500">Qty: {item.quantity}</p>
                    </div>

                    <p className="text-lg font-black text-[#5DD3B6] ">
                      {Number(item.subtotal).toFixed(2)}
                      <span className="text-[12px] text-neutral-600"> INR</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 text-[12px] font-bold text-neutral-600">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 stroke-[#ED7B7B]" />
                  {order.deliveryName}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 stroke-[#ED7B7B]" />
                  {order.deliveryPhone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 stroke-[#ED7B7B]" />
                  {order.deliveryAddress}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">Total</span>

                <span className="text-3xl font-black text-[#5DD3B6]">
                  {Number(order.total).toFixed(2)}
                  <span className="text-[12px] text-neutral-600"> INR</span>
                </span>
              </div>

              {/* Cancel handled by top-right icon; removed bottom button */}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default CustomerOrders;

