import { useMenu } from "../context/MenuContext";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Menu() {
  const { menuItems, loading, error } = useMenu();
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { isAuthenticated: isAdmin } = useAdminAuth();

  if (loading) {
    return <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6"><p className="text-xl font-black text-neutral-500">Loading menu...</p></main>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-6">
      <div className="mb-6 px-[32px] flex items-center gap-4">
        <h1 className="text-2xl font-black">Menu</h1>
        <div className="h-12  w-[1px] bg-neutral-400"></div>
        <p className="max-w-xl text-[12px]
         font-medium leading-6 text-neutral-700">
          Pick your favorite dishes and let the evening find its flavor.
          We will be at your doorstep, or on the rooftop if Batman and Spiderman help us sometimes.
        </p>
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
