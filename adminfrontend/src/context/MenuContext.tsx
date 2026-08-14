import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getMenuItems } from "../services/menu.service";
import type { MenuItem } from "../types/menu";

type MenuContextType = {
  menuItems: MenuItem[];
  loading: boolean;
  error: string;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMenu() {
      try {
        setError("");

        const data = await getMenuItems();

        setMenuItems(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load menu",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used inside MenuProvider");
  }

  return context;
}
