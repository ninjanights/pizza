import { useAdminAuth } from "../context/AdminAuthContext";
import AdminNavbar from "../components/admin/AdminNavbar";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import Menu from "./Menu";

export default function MenuPage() {
  const { isAuthenticated } = useAdminAuth();

  return (
    <div className="min-h-screen bg-neutral-300">
      {isAuthenticated ? (
        <AdminNavbar />
      ) : (
        <CustomerNavbar />
      )}

      <main>
        <Menu />
      </main>
    </div>
  );
}