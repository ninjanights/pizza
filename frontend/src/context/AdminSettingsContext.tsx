import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getStoreSettings,
  updateAutoOrderProgression,
  type StoreSettings,
} from "../services/adminSettings.service";

type AdminSettingsContextType = {
  settings: StoreSettings | null;
  loading: boolean;
  error: string;
  setAutoOrderProgression: (
    enabled: boolean,
  ) => Promise<void>;
};

const AdminSettingsContext =
  createContext<AdminSettingsContextType | undefined>(
    undefined,
  );

export function AdminSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data = await getStoreSettings();

        setSettings(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load settings",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function setAutoOrderProgression(
    enabled: boolean,
  ) {
    const updated =
      await updateAutoOrderProgression(enabled);

    setSettings(updated);
  }

  return (
    <AdminSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        setAutoOrderProgression,
      }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);

  if (!context) {
    throw new Error(
      "useAdminSettings must be used inside AdminSettingsProvider",
    );
  }

  return context;
}