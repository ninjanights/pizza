import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { initializeCustomerSession } from "../services/session.service";

type CustomerSessionContextType = {
  initialized: boolean;
  loading: boolean;
};

const CustomerSessionContext =
  createContext<CustomerSessionContextType | undefined>(
    undefined
  );

export function CustomerSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        await initializeCustomerSession();
        setInitialized(true);
      } catch (error) {
        console.error(
          "Failed to initialize customer session:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <CustomerSessionContext.Provider
      value={{
        initialized,
        loading,
      }}
    >
      {children}
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession() {
  const context = useContext(CustomerSessionContext);

  if (!context) {
    throw new Error(
      "useCustomerSession must be used inside CustomerSessionProvider"
    );
  }

  return context;
}