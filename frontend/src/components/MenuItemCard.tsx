import { CookingPot, Minus, Plus } from "lucide-react";
import type { MenuItem } from "./../types/menu";

type MenuItemCardProps = {
  item: MenuItem;
  isAdmin?: boolean;
  quantity: number;
  onAddToCart: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const foodIcons = ["/breakfast.svg", "/pizza.svg", "/roll.svg", "/sushi.svg"];
const quantityButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg text-neutral-800 disabled:opacity-40";

function getFoodIcon(itemId: string) {
  const iconIndex = itemId.length % foodIcons.length;

  return foodIcons[iconIndex];
}

export default function MenuItemCard({
  item,
  isAdmin = false,
  quantity,
  onAddToCart,
  onIncrease,
  onDecrease,
}: MenuItemCardProps) {
  const foodIcon = getFoodIcon(item.id);

  return (
    <div className="rounded-xl bg-neutral-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CookingPot className="h-4 w-4 shrink-0 stroke-[#ED7B7B]" />
            <h2 className="truncate text-lg font-black">{item.name}</h2>
          </div>

          <p className="mt-1 text-[12px] font-bold text-neutral-500">
            {item.description}
          </p>

          <p className="mt-3 text-2xl sm:text-4xl font-black text-[#5DD3B6]">
            {item.price}
            <span className="ml-1 text-[12px] text-neutral-600">INR</span>
          </p>
        </div>

        <img
          src={foodIcon}
          alt=""
          className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 object-contain"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold text-neutral-500">
          <span className="text-lg font-black">{Math.max(0, item.inventory - quantity)}</span> Available
        </p>

        {!isAdmin && (
          <div>
            {quantity === 0 ? (
              <button
                onClick={onAddToCart}
                disabled={item.inventory <= 0}
                className="rounded-lg border-4 border-neutral-400 bg-transparent px-4 py-2 font-black text-neutral-800 disabled:opacity-40"
              >
                Add to cart
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={onDecrease} className={quantityButtonClass}>
                  <Minus className="h-6 w-6" strokeWidth={3} />
                </button>

                <span className="min-w-6 text-center text-2xl sm:text-4xl font-black text-neutral-800">
                  {quantity}
                </span>

                <button
                  onClick={onIncrease}
                  disabled={quantity >= item.inventory}
                  className={quantityButtonClass}
                >
                  <Plus className="h-6 w-6" strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
