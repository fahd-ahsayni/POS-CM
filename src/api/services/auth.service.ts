import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { ApiResponse } from "@/interfaces/api";
import { User } from "@/interfaces/user";
import { toast } from "react-toastify";

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (
  id: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const ipAddress = localStorage.getItem("ipAddress");
    const baseUrl =
      ipAddress || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

    const response = await api.post(
      `${baseUrl}/auth/login`,
      { id, password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(
      createToast(
        "Error logging in",
        "Please check your credentials",
        "error"
      )
    );
    throw error;
  }
};

export const loginWithRfid = async (rfid: string) => {
  return api.post(
    "/auth/login-with-rfid",
    {
      rfid: rfid,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
      },
    }
  );
};

export const checkAdminRfid = async (rfid: string) => {
  return api.post("/auth/check-admin-rfid/", {
    admin_rfid: rfid,
  });
};

export const logoutService = async (): Promise<void> => {
  try {
    const ipAddress = localStorage.getItem("ipAddress");
    localStorage.clear();
    localStorage.setItem("ipAddress", ipAddress || "");
  } catch (error) {
    toast.error(
      createToast(
        "Error logging out",
        "An unexpected error occurred while trying to log out",
        "error"
      )
    );
  }
};

export const checkAuthorization = async (
  passcode: string
): Promise<ApiResponse<any>> => {
  return api.post("/auth/check-admin-password", { admin_password: passcode });
};
