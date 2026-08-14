import { NavLink, useNavigate } from "react-router-dom";
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
    <nav className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      {/* Logo */}
      <NavLink to="/dashboard" className="text-xl font-bold text-zinc-900">
        🍕 Pizza Server
      </NavLink>

      {/* Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-zinc-900"
              : "font-medium text-zinc-500 hover:text-zinc-900"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-zinc-900"
              : "font-medium text-zinc-500 hover:text-zinc-900"
          }
        >
          Menu
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-zinc-900"
              : "font-medium text-zinc-500 hover:text-zinc-900"
          }
        >
          Orders
        </NavLink>

        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
