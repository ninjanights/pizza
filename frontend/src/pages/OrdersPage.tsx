import { useAdminAuth } from "../context/AdminAuthContext";
import AdminOrders from "./AdminOrders";
import CustomerOrders from "./CustomerOrders";

export default function OrdersPage() {
  const { isAuthenticated } = useAdminAuth();

  if (isAuthenticated) {
    return <AdminOrders />;
  }

  return <CustomerOrders />;
}