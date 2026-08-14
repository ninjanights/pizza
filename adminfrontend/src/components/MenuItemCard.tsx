import type { MenuItem } from "./../types/menu";
import { CookingPot } from "lucide-react";

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
    <div className="rounded-xl bg-neutral-200 p-4">
      <div className="flex gap-2 items-center">
        <CookingPot className="h-4 w-4 stroke-[#D99B77]" />

      <h2 className="text-lg font-black">{item.name}</h2>
      </div>
      <p className="mt-1 text-[12px] font-bold text-neutral-500">{item.description}</p>
      
      <p className="mt-3 text-4xl font-black text-[#769898]">{item.price}<span className="text-[12px] text-neutral-600">INR</span></p>
     
     <div className="flex gap-2 mt-1 items-center justify-between">
      <p className="text-[12px] font-semibold text-neutral-500"><span className="font-black text-lg">{item.inventory}</span> Available</p>

      {!isAdmin && (
        <div className="">
          {quantity === 0 ? (
            <button
              onClick={onAddToCart}
              disabled={item.inventory <= 0}
              className="rounded-lg bg-transparent 
              border-4 border-neutral-400 px-4 py-2 text-neutral-800 font-black disabled:opacity-40"
            >
              Add to cart
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onDecrease}
                className="flex h-9 w-9 items-center
                 items-center justify-center 
                 font-black text-4xl text-neutral-800
                 rounded-lg "
              >
            {/* <Minus className="h-4 w-4 stroke-4"></Minus> */}
-
              </button>

              <span className="min-w-6 
              text-center font-black text-neutral-800 text-4xl">
                {quantity}
              </span>

              <button
                onClick={onIncrease}
                disabled={quantity >= item.inventory}
                className="flex h-9 w-9 
                items-center justify-center
                  font-black
                 rounded-lg  text-4xl text-neutral-800
                 disabled:opacity-40"
              >
              {/* <Plus className="h-4 w-4  stroke-4"></Plus> */}
              +
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
