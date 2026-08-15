import { useNavigate } from "react-router-dom";
import OrderStatusCard from "../components/admin/OrderStatusCard";
import { useAdminOrders } from "../context/AdminOrderContext";
import { useAdminSettings } from "../context/AdminSettingsContext";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const { dashboard, loading : dashboardLoading, error } = useAdminOrders();
   const {
    settings,
    loading : settingsLoading,
    setAutoOrderProgression,
  } = useAdminSettings();

if (dashboardLoading) {
  return <p>Loading dashboard...</p>;
}

if (settingsLoading) {
  return <p>Loading settings...</p>;
}
  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <main className="px-6 py-8">
      <div className="mb-6 flex items-center gap-4 px-8">
        <h1 className="text-3xl font-black text-neutral-900">Pizza Base</h1>
        <div className="h-12 w-[1px] bg-neutral-400"></div>
        <p className="max-w-xl text-sm font-medium leading-6 text-neutral-700">
          Pick your favorite dishes and let the evening find its flavor. We will
          be at your doorstep, or on the rooftop if Batman and Spiderman help us
          sometimes.
        </p>


  {/* Settings (inline) */}
  <div className="ml-4 flex items-center gap-4">
    <div>
      <p className="text-sm font-black text-neutral-900">Automatic Order Progression</p>
      <p className="text-xs font-medium text-neutral-600">Automatically move orders to the next status every 20 seconds.</p>
    </div>

    <div className="text-neutral-400">•</div>

    <button
      onClick={() => setAutoOrderProgression(!settings?.autoOrderProgression)}
      className={
        settings?.autoOrderProgression
          ? "home-login-button rounded-xl px-4 py-2 text-sm font-bold text-neutral-100"
          : "rounded-xl px-4 py-2 bg-neutral-300 text-sm font-bold text-neutral-900"
      }
    >
      {settings?.autoOrderProgression ? "ON" : "OFF"}
    </button>
  </div>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.statuses.map((status) => (
          <OrderStatusCard
            key={status.status}
            data={status}
            onClick={() => navigate(`/orders?status=${status.status}`)}
          />
        ))}
      </div>
    </main>
  );
}
