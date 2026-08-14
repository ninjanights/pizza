import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";

export default function CustomerLayout() {
  return (
    <div>
      <CustomerNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}