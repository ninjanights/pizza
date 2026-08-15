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
    <main className="mx-auto w-full max-w-2xl bg-transparent p-6">
      <h1 className="mb-5 text-center text-xl font-bold text-neutral-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-700">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="home-auth-input font-black w-full border-4 border-neutral-400 rounded-lg px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-700">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="home-auth-input font-black 
            w-full border-4 
            border-neutral-400 rounded-lg px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-700">
            Address
          </label>

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          
            className="home-auth-input font-black w-full border-4 border-neutral-400 rounded-lg px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700"
          />
        </div>

        <div className="pt-4">
          <p className="text-[24px]  font-black text-neutral-800">
            Total: <span className=" mr-1 text-4xl font-black text-[#5DD3B6]">{totalPrice.toLocaleString("en-IN")}</span><span className="text-sm">INR</span>
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="home-login-button w-full rounded-xl px-6 py-5 text-center text-lg font-bold text-neutral-100 disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Confirm Order"}
        </button>
      </form>
    </main>
  );
}