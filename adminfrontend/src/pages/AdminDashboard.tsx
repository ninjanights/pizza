import OrderStatusCard from "../components/admin/OrderStatusCard";
import { useOrders } from "../context/OrderContext";

export default function AdminDashboard() {
  const { dashboard, loading, error } = useOrders();

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <div>
      <h1>Pizza Base</h1>

      <div className="grid grid-cols-3 gap-4">
        {dashboard.statuses.map((status) => (
          <OrderStatusCard key={status.status} data={status} />
        ))}
      </div>
    </div>
  );
}
