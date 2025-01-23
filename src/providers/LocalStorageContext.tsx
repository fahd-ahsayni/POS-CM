import { useLocalStorage } from "@/hooks/use-local-storage";
import { createContext, useContext } from "react";

interface LocalStorageContextType {
  posTheme: string;
  setPosTheme: (value: string) => void;
  users: any[] | null;
  setUsers: (value: any[] | null) => void;
  user: any | null;
  setUser: (value: any | null) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  shiftId: string | null;
  setShiftId: (value: string | null) => void;
  orderType: string | null;
  setOrderType: (value: string | null) => void;
}

export const LocalStorageContext = createContext<LocalStorageContextType>(
  {} as LocalStorageContextType
);

export function useLocalStorageContext() {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error(
      "useLocalStorageContext must be used within a LocalStorageProvider"
    );
  }
  return context;
}

export function LocalStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [posTheme, setPosTheme] = useLocalStorage<string>("pos-theme", "dark");
  const [users, setUsers] = useLocalStorage<any[] | null>("users", null);
  const [user, setUser] = useLocalStorage<any | null>("user", null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [shiftId, setShiftId] = useLocalStorage<string | null>("shiftId", null);
  const [orderType, setOrderType] = useLocalStorage<string | null>(
    "orderType",
    null
  );

  return (
    <LocalStorageContext.Provider
      value={{
        posTheme,
        setPosTheme,
        users,
        setUsers,
        user,
        setUser,
        token,
        setToken,
        shiftId,
        setShiftId,
        orderType,
        setOrderType,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
}
