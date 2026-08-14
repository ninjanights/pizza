import { Clock, MapPin, Phone, ShoppingCart, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerOrders } from "../context/CustomerOrdersContext";
import type { OrderStatus } from "../types/order";

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

function getStatusClass(status: OrderStatus) {
  if (status === "CANCELLED") return "orders-status-cancelled text-red-700";
  if (status === "DELIVERED") return "orders-status-delivered text-green-700";
  return "orders-status-active text-neutral-800";
}

function CustomerOrders() {
  const navigate = useNavigate();
  const { orders, loading, error, cancelOrder } = useCustomerOrders();

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-xl font-black text-neutral-700">Loading your orders...</p>
        </div>
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

        <div className="orders-card mx-auto flex max-w-md flex-col items-center rounded-xl p-8 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 stroke-[#D99B77]" />
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
        {orders.map((order) => (
          <div key={order.id} className="orders-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 stroke-[#D99B77]" />
                  <p className="text-lg font-black text-neutral-900">
                    Order #{order.id.slice(0, 8)}
                  </p>
                </div>

                <p className="mt-1 flex items-center gap-1 text-[12px] font-bold text-neutral-500">
                  <Clock className="h-3 w-3" />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1 text-[12px] font-black ${getStatusClass(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-neutral-900">
                      {item.menuItem.name}
                    </p>
                    <p className="text-[12px] font-bold text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-lg font-black text-[#769898]">
                    {Number(item.subtotal).toFixed(2)}
                    <span className="text-[12px] text-neutral-600">INR</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-2 text-[12px] font-bold text-neutral-600">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 stroke-[#D99B77]" />
                {order.deliveryName}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 stroke-[#D99B77]" />
                {order.deliveryPhone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 stroke-[#D99B77]" />
                {order.deliveryAddress}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">
                Total
              </span>

              <span className="text-4xl font-black text-[#769898]">
                {Number(order.total).toFixed(2)}
                <span className="text-[12px] text-neutral-600">INR</span>
              </span>
            </div>

            {order.status === "RECEIVED" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-black text-red-600"
              >
                <Trash2 className="h-4 w-4" strokeWidth={3} />
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default CustomerOrders;