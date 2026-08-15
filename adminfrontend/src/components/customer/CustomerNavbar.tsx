import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Utensils } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CustomerNavbar() {
    const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    
    <nav className="flex h-16 items-center justify-between bg-neutral-300 px-6">
      <div className="flex items-center gap-3">
        <NavLink to="/menu" className="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <img src="/pizza.svg" alt="Pizza" className="h-7 w-7" />
          <span>Pizza Loom</span>
        </NavLink>
        <span className="text-zinc-500">·</span>
        <button
          onClick={() => navigate("/admin/login")}
          className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-[#ED7B7B]"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Dining Wall</span>
        </button>
      </div>


      <div className="flex items-center gap-6">
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-zinc-500 hover:text-[#ED7B7B]"
          }
        >
          <span className="flex items-center gap-2"><Utensils className="h-4 w-4" />Menu</span>
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
            <ShoppingCart className="h-4 w-4" />
            Cart
            {totalItems > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200">
                <span className="text-[10px] font-black leading-none text-[#D99B77]">{totalItems}</span>
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
          <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Orders</span>
        </NavLink>
      </div>
    </nav>
  );
}

