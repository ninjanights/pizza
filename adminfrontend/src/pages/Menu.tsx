import { useMenu } from "../context/MenuContext";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Menu() {
  const { menuItems, loading, error } = useMenu();
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { isAuthenticated: isAdmin } = useAdminAuth();

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">🍕 Menu</h1>

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
