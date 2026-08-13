import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:8000/api/admin/me", {
          credentials: "include",
        });

        setAuthenticated(response.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
