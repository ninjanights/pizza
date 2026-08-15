import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <AdminNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
