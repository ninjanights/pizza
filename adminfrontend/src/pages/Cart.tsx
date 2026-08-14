import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
    return <p>Your cart is empty.</p>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">🛒 Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex items-center justify-between rounded-xl border bg-white p-4"
          >
            <div>
              <h2 className="font-semibold">
                {item.menuItem.name}
              </h2>

              <p className="text-sm text-zinc-500">
                INR{item.menuItem.price} each
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  decreaseQuantity(item.menuItem.id)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border"
              >
                −
              </button>

              <span className="min-w-5 text-center font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(item.menuItem.id)
                }
                disabled={
                  item.quantity >= item.menuItem.inventory
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p className="font-semibold">
              ₹
              {(
                Number(item.menuItem.price) *
                item.quantity
              ).toLocaleString("en-IN")}
            </p>

            <button
              onClick={() =>
                removeFromCart(item.menuItem.id)
              }
              className="text-sm text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">
          Total: ₹{totalPrice.toLocaleString("en-IN")}
        </p>
      </div>



      <div className="mt-8 flex items-center justify-between">
        <p className="text-xl font-bold">
          Total: ₹{totalPrice.toLocaleString("en-IN")}
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white"
        >
          Place Order
        </button>
      </div>
    </main>
  );
}