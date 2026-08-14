import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <AdminNavbar  />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
