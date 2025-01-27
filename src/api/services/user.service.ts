import { api } from "@/api/axios";
import { User } from "@/types/user.types";

type UserPosition = "Cashier" | "Manager" | "Waiter" | "Livreur";

const fetchUsersByPosition = async (position: UserPosition): Promise<User[]> => {
  const response = await api.get<User[]>(
    `${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}/users?position=${position}`,
    {
      timeout: 5000,
      headers: {
        Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
      },
    }
  );
  return response.data;
};

export const fetchCashiers = () => fetchUsersByPosition("Cashier");
export const fetchManagers = () => fetchUsersByPosition("Manager");
export const fetchWaiters = () => api.get("/users/with-token?position=Waiter");
export const fetchLivreurs = () => api.get("users/with-token?position=Livreur");
