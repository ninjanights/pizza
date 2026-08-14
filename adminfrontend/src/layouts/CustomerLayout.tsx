import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <CustomerNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
