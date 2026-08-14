import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { OrdersProvider } from "./context/OrderContext";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <OrdersProvider>
        <Routes>
          {/* Only ppl */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AdminLogin />} />
          </Route>

          {/* secured */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Route>

          {/* unkn */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </OrdersProvider>
    </BrowserRouter>
  );
}

export default App;
