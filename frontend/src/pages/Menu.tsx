import { useMenu } from "../context/MenuContext";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Menu() {
  const { menuItems, loading, error } = useMenu();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, totalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated: isAdmin } = useAdminAuth();

  if (loading) {
    return <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6"><p className="text-xl font-black text-neutral-500">Loading menu...</p></main>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-6">
      <div className="mb-6 px-[32px] flex items-start gap-4">
        <h1 className="text-2xl font-black">Menu</h1>
        <div className="h-12 w-[1px] bg-neutral-400"></div>
        <div className="max-w-xl text-[12px] font-medium leading-6 text-neutral-700 flex flex-col sm:flex-row items-start gap-3">
          <p className="m-0">
            Pick your favorite dishes and let the evening find its flavor.
            We will be at your doorstep, or on the rooftop if Batman and Spiderman help us sometimes.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-neutral-400">·</span>

            <button
              onClick={() => totalItems > 0 && navigate("/cart")}
              aria-disabled={totalItems === 0}
              className={
                totalItems > 0
                  ? "flex-shrink-0 text-[#ED7B7B] font-black rounded-lg px-4 py-2 inline-flex items-center gap-2"
                  : "flex-shrink-0 text-neutral-500 font-black rounded-lg px-4 py-2 inline-flex items-center gap-2"
              }
            >
              Place Order
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => {
          const cartItem = cart.items.find(
            (cartItem) => cartItem.menuItem.id === item.id,
          );

          const quantity = cartItem?.quantity ?? 0;

          return (
            <MenuItemCard
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              quantity={quantity}
              onAddToCart={() => addToCart(item)}
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
            />
          );
        })}
      </div>

    
    </main>
  );
}
