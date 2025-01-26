import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { ApiResponse, LoginCredentials, RfidCredentials } from "@/types/api";
import { toast } from "react-toastify";

export class AuthService {
  private static baseUrl =
    window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;
  private static apiKey = import.meta.env.VITE_API_KEY;

  static async login({
    id,
    password,
  }: LoginCredentials): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(
        `${this.baseUrl}/auth/login`,
        { id, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      toast.error(
        createToast(
          "Error logging in",
          "Please check your credentials and try again",
          "error"
        )
      );
      throw error;
    }
  }

  static async loginWithRfid({
    rfid,
  }: RfidCredentials): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(
        `${this.baseUrl}/auth/login-with-rfid`,
        { rfid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in with RFID:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      toast.error(
        createToast(
          "Error logging out",
          "An unexpected error occurred while trying to log out",
          "error"
        )
      );
    }
  }

  static async checkAuthorization(passcode: string): Promise<ApiResponse<any>> {
    return api.post("/auth/check-admin-password", { admin_password: passcode });
  }
}
