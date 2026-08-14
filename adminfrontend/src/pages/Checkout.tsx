import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrderCustomer } from "../services/order.service";
export default function Checkout() {
  const navigate = useNavigate();

  const { cart, totalPrice, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createOrderCustomer({
        deliveryName: name,
        deliveryPhone: phone,
        deliveryAddress: address,
        items: cart.items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
      });

      clearCart();

      navigate("/walkinorders");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Address
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-lg font-bold">
            Total: ₹{totalPrice.toLocaleString("en-IN")}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Confirm Order"}
        </button>
      </form>
    </main>
  );
}