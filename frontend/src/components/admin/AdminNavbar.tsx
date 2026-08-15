import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, Utensils } from "lucide-react";
import { adminLogout } from "../../services/admin.service";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  async function handleLogout() {
    try {
      await adminLogout();
     
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
         logout()
      
      navigate("/", { replace: true });
    }
  }

  return (
    <nav className="relative flex flex-col gap-2 bg-neutral-300 px-4 py-3 
    sm:flex-row sm:h-16 sm:items-center sm:justify-between sm:px-6 sm:py-0">
      {/* Logo */}
      <div className="flex items-center justify-center gap-8 sm:justify-start">
        <NavLink to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-zinc-900 sm:text-xl">
          <img src="/pizza.svg" alt="Pizza" className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Pizza Loom</span>
        </NavLink>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-zinc-500 hover:text-[#ED7B7B]"
          }
        >
          Dashboard
        </NavLink>
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
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#ED7B7B]"
              : "font-bold text-zinc-500 hover:text-[#ED7B7B]"
          }
        >
          <span className="flex items-center gap-1 gap-2"><ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Orders</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-zinc-500 hover:text-[#ED7B7B] gap-2 sm:px-3 sm:py-2"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Logout
        </button>
      </div>

      
    </nav>
  );
}

