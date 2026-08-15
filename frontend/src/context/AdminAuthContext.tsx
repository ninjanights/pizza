import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AdminAuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use sessionStorage.
    // Later we can verify the admin cookie with the backend.
    const authenticated = sessionStorage.getItem("adminAuthenticated");

    setIsAuthenticated(authenticated === "true");
    setLoading(false);
  }, []);

  function login() {
    sessionStorage.setItem("adminAuthenticated", "true");
    setIsAuthenticated(true);
  }

  function logout() {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return context;
}
