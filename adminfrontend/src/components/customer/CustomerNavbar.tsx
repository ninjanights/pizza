import { NavLink } from "react-router-dom";

export default function CustomerNavbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <NavLink to="/menu" className="text-xl font-bold text-zinc-900">
        🍕 Pizza Loom
      </NavLink>

      <div className="flex items-center gap-6">
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
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-zinc-900"
              : "font-medium text-zinc-500 hover:text-zinc-900"
          }
        >
          Cart
        </NavLink>

        <NavLink
          to="/walkinorders"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-zinc-900"
              : "font-medium text-zinc-500 hover:text-zinc-900"
          }
        >
          Orders
        </NavLink>
      </div>
    </nav>
  );
}
