import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AdminOrdersProvider } from "./context/AdminOrderContext";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import { MenuProvider } from "./context/MenuContext";
import CustomerOrders from "./pages/CustomerOrders";
import Cart from "./pages/Cart";
import CustomerLayout from "./layouts/CustomerLayout";
import MenuPage from "./pages/MenuPage";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import { CustomerOrdersProvider } from "./context/CustomerOrdersContext";
import { CustomerSessionProvider } from "./context/CustomerSessionContext";
import { AdminSettingsProvider } from "./context/AdminSettingsContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AdminAuthProvider>
          <MenuProvider>
                     <AdminSettingsProvider>
            <AdminOrdersProvider>
              <CustomerSessionProvider>
                <CustomerOrdersProvider>
                  <Routes>
                    {/* Public */}
                    <Route element={<PublicRoute />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<MenuPage />} />

                      <Route element={<CustomerLayout />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />

                        <Route
                          path="/walkinorders"
                          element={<CustomerOrders />}
                        />
                      </Route>
                    </Route>

                    {/* Protected admin */}
                    <Route element={<ProtectedRoute />}>
             
                        <Route element={<AdminLayout />}>
                          <Route
                            path="/dashboard"
                            element={<AdminDashboard />}
                          />
                          <Route path="/orders" element={<AdminOrders />} />
                        </Route>
                  
                    </Route>

                    {/* Unknown route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </CustomerOrdersProvider>
              </CustomerSessionProvider>
            </AdminOrdersProvider>
            </AdminSettingsProvider>
          </MenuProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
