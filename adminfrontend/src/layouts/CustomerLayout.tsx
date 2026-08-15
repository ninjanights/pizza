import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import Footer from "../components/Footer";

export default function CustomerLayout() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <CustomerNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
