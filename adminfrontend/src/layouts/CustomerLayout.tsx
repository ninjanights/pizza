import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";

export default function CustomerLayout() {
  return (
    <div className="app-shell">
      <CustomerNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
