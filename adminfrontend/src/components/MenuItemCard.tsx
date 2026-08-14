import type { MenuItem } from "./../types/menu";

type MenuItemCardProps = {
  item: MenuItem;
  isAdmin?: boolean;
  quantity: number;
  onAddToCart: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function MenuItemCard({
  item,
  isAdmin = false,
  quantity,
  onAddToCart,
  onIncrease,
  onDecrease,
}: MenuItemCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-lg font-semibold">{item.name}</h2>

      <p className="mt-1 text-sm text-zinc-500">{item.description}</p>

      <p className="mt-3 font-semibold">₹{item.price}</p>

      <p className="mt-1 text-sm text-zinc-500">{item.inventory} available</p>

      {!isAdmin && (
        <div className="mt-4">
          {quantity === 0 ? (
            <button
              onClick={onAddToCart}
              disabled={item.inventory <= 0}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
            >
              Add to cart
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onDecrease}
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
              >
                −
              </button>

              <span className="min-w-6 text-center font-semibold">
                {quantity}
              </span>

              <button
                onClick={onIncrease}
                disabled={quantity >= item.inventory}
                className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
