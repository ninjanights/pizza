import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Pizza, ShoppingCart, Utensils } from "lucide-react";
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
    <nav className="flex h-16 items-center justify-between bg-neutral-300 px-6">
      {/* Logo */}
      <NavLink to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-zinc-900">
        <Pizza className="h-6 w-6" />
        <span>Pizza</span>
      </NavLink>

      {/* Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#D99B77]"
              : "font-bold text-zinc-500 hover:text-[#D99B77]"
          }
        >
          Dashboard
        </NavLink>
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
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#D99B77]"
              : "font-bold text-zinc-500 hover:text-[#D99B77]"
          }
        >
          <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" />Orders</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-zinc-500 hover:bg-zinc-100 hover:text-[#D99B77]"
        >
          <LogOut className="h-4 w-4" />Logout
        </button>
      </div>
    </nav>
  );
}
