import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const pageHeaderClass = "mb-6 flex items-center gap-4 px-8";
const headerTextClass = "max-w-xl text-[12px] font-medium leading-6 text-neutral-700";
const quantityButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg text-neutral-800 disabled:opacity-40";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (cart.items.length === 0) {
    return (
      <main className="p-6">
        <div className={pageHeaderClass}>
          <h1 className="text-2xl font-black">Cart</h1>
          <div className="h-12 w-[1px] bg-neutral-400"></div>
          <p className={headerTextClass}>
            Your cart is waiting for its first little masterpiece. Pick a
            favorite dish and we will start warming up the route.
          </p>
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center rounded-xl p-8 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 stroke-[#ED7B7B]" />
          <p className="text-xl font-black text-neutral-800">Your cart is empty.</p>
          <button
            onClick={() => navigate("/menu")}
            className="cart-accent-button mt-5 rounded-lg px-6 py-3 font-black text-neutral-900"
          >
            Back to Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className={pageHeaderClass}>
        <h1 className="text-2xl font-black">Cart</h1>
        <div className="h-12 w-[1px] bg-neutral-400"></div>
        <p className={headerTextClass}>
          Your chosen bites are lined up and ready for the road. One tap more
          and we will bring the feast to your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.menuItem.id} className="cart-card rounded-xl p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 stroke-[#ED7B7B]" />
                    <h2 className="text-lg font-black text-neutral-900">
                      {item.menuItem.name}
                    </h2>
                  </div>

                  <p className="mt-1 text-[12px] font-bold text-neutral-500">
                    {item.menuItem.price} INR each
                  </p>

                  <p className="mt-3 text-4xl font-black text-[#5DD3B6]">
                    {(Number(item.menuItem.price) * item.quantity).toLocaleString("en-IN")}
                    <span className="text-[12px] text-neutral-600">INR</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.menuItem.id)}
                      className={quantityButtonClass}
                      aria-label={`Decrease ${item.menuItem.name}`}
                    >
                      <Minus className="h-6 w-6" strokeWidth={3} />
                    </button>

                    <span className="min-w-6 text-center text-4xl font-black text-neutral-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.menuItem.id)}
                      disabled={item.quantity >= item.menuItem.inventory}
                      className={quantityButtonClass}
                      aria-label={`Increase ${item.menuItem.name}`}
                    >
                      <Plus className="h-6 w-6" strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="flex items-center gap-1 text-[12px] font-black text-[#FF746C]"
                  >
                    <Trash2 className="h-6 w-6" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl p-5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">
            Cart Total
          </p>
          <p className="mt-2 text-5xl font-black text-[#5DD3B6]">
            {totalPrice.toLocaleString("en-IN")}
            <span className="text-[12px] text-neutral-600">INR</span>
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="cart-accent-button mt-6 w-full rounded-xl px-6 py-5 text-center text-lg font-black text-neutral-900"
          >
            Place Order
          </button>
        </aside>
      </div>
    </main>
  );
}
