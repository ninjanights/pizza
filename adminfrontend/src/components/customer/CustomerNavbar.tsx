import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, Pizza, ShoppingCart, Utensils } from "lucide-react";

export default function CustomerNavbar() {
    const navigate = useNavigate();

  return (
    
    <nav className="flex h-16 items-center justify-between bg-neutral-300 px-6">
      <div className="flex items-center gap-3">
        <NavLink to="/menu" className="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <Pizza className="h-6 w-6" />
          <span>Pizza Loom</span>
        </NavLink>
        <span className="text-zinc-500">·</span>
        <button
          onClick={() => navigate("/admin/login")}
          className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-[#D99B77]"
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
              ? "font-bold text-[#D99B77]"
              : "font-bold text-zinc-500 hover:text-[#D99B77]"
          }
        >
          <span className="flex items-center gap-2"><Utensils className="h-4 w-4" />Menu</span>
        </NavLink>




        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#D99B77]"
              : "font-bold text-zinc-500 hover:text-[#D99B77]"
          }
        >
          <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Cart</span>
        </NavLink>

        <NavLink
          to="/walkinorders"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#D99B77]"
              : "font-bold text-zinc-500 hover:text-[#D99B77]"
          }
        >
          <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Orders</span>
        </NavLink>
      </div>
    </nav>
  );
}
