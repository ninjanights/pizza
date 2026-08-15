import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Utensils } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CustomerNavbar() {
    const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    
    <nav className="relative flex flex-col gap-2 bg-neutral-300 px-4 py-3 sm:flex-row sm:h-16 sm:items-center sm:justify-between sm:px-6 sm:py-0">
      <div className="flex items-center justify-center gap-3 sm:justify-start">
        <NavLink to="/menu" className="flex items-center gap-2 text-lg font-bold text-zinc-900 sm:text-xl">
          <img src="/pizza.svg" alt="Pizza" className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Pizza Loom</span>
        </NavLink>
        <span className="text-zinc-500">·</span>
        <button
          onClick={() => navigate("/admin/login")}
          className="flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-[#ED7B7B] sm:text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Dining Wall</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center text-xs gap-6  sm:text-sm">
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-zinc-500 hover:text-[#ED7B7B]"
          }
        >
          <span className="flex items-center gap-1 sm:gap-2"><Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Menu</span>
        </NavLink>




        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-neutral-500 hover:text-[#ED7B7B]"
          }
        >
          <span className="flex items-center gap-1">
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Cart
            {totalItems > 0 && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-neutral-200 sm:h-5 sm:w-5">
                <span className="text-[8px] font-black leading-none text-[#D99B77] sm:text-[10px]">{totalItems}</span>
              </span>
            )}
          </span>
        </NavLink>

        <NavLink
          to="/walkinorders"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-neutral-500 hover:text-[#ED7B7B]"
          }
        >
          <span className="flex items-center gap-1 sm:gap-2"><ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Orders</span>
        </NavLink>
      </div>

      
    </nav>
  );
}


