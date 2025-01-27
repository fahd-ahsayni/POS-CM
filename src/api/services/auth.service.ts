import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { ApiResponse } from "@/types/api";
import { toast } from "react-toastify";

export const login = async (id: string, password: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(
      `${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}/auth/login`,
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
    toast.error(createToast("Error logging in", "Please check your credentials and try again", "error"));
    throw error;
  }
};

export const loginWithRfid = async (rfid: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(
      `${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}/auth/login-with-rfid`,
      { rfid },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in with RFID:", error);
    throw error;
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    localStorage.clear();
  } catch (error) {
    toast.error(createToast("Error logging out", "An unexpected error occurred while trying to log out", "error"));
  }
};

export const checkAuthorization = async (passcode: string): Promise<ApiResponse<any>> => {
  return api.post("/auth/check-admin-password", { admin_password: passcode });
};
