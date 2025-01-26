import { api } from "@/api/axios";
import { User } from "@/types/user.types";
import { UserPosition } from "@/types/api";

export class UserService {
  private static apiKey = import.meta.env.VITE_API_KEY;
  private static baseUrl =
    window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

  private static async fetchUsersByPosition(
    position: UserPosition
  ): Promise<User[]> {
    const response = await api.get<User[]>(
      `${this.baseUrl}/users?position=${position}`,
      {
        timeout: 5000,
        headers: {
          Authorization: `Api-Key ${this.apiKey}`,
        },
      }
    );
    return response.data;
  }

  static async getCashiers(): Promise<User[]> {
    return this.fetchUsersByPosition("Cashier");
  }

  static async getManagers(): Promise<User[]> {
    return this.fetchUsersByPosition("Manager");
  }

  static async getWaiters(): Promise<User[]> {
    return api.get("/users/with-token?position=Waiter");
  }

  static async getLivreurs(): Promise<User[]> {
    return api.get("users/with-token?position=Livreur");
  }
}
