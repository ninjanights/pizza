import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { OrdersProvider } from "./context/OrderContext";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import { MenuProvider } from "./context/MenuContext";
import Menu from "./pages/Menu";
import CustomerOrders from "./pages/CustomerOrders";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <OrdersProvider>
          <Routes>
            {/* Public */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/walkinorders" element={<CustomerOrders />} />
            </Route>

            {/* Protected admin */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>

            {/* Unknown route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrdersProvider>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;
