import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { toast } from "react-toastify";

export const login = async (id: string, password: string) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
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
        "Please check your credentials and try again",
        "error"
      )
    );
    throw error;
  }
};

export const loginWithRfid = async (rfid: string) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_BASE_URL}/auth/login-with-rfid`,
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

export const getByTableName = async (tableName: string) => {
  return api.get(`/order/by-table-name/${tableName}`);
};

export const openCashDrawer = async (shiftId: string) => {
  return api.post("/pos/open-cashdrawer", { shift_id: shiftId });
};

export const openShift = async (startingBalance: string, posId: string) => {
  return api.post("/shift/open", {
    starting_balance: startingBalance,
    pos_id: posId,
  });
};

export const createOrder = async (data: any) => {
  return api.post("/order/create", data);
};

export const getOrdersByDay = async () => {
  return api.get("/order/by-day");
};

export const printOrder = async (
  orderId: string,
  orderlines: string[] = []
) => {
  try {
    const posId = localStorage.getItem("posId");
    if (!posId) {
      throw new Error("POS ID not found in local storage");
    }

    const requestData = {
      order_id: orderId,
      pos_id: posId,
      ...(orderlines.length > 0 && { orderlines_ids: orderlines }),
    };

    const response = await api.post("/order/printer", requestData);

    const message =
      response.status === 200
        ? ([
            "Order printed successfully",
            "The order has been sent to the printer",
            "success",
          ] as const)
        : ([
            "Failed to print order",
            "Please check the printer connection and try again",
            "error",
          ] as const);

    toast[message[2] as "success" | "error"](
      createToast(message[0], message[1], message[2])
    );
    return response;
  } catch (error) {
    toast.error(
      createToast(
        "Error printing order",
        "An unexpected error occurred while trying to print the order",
        "error"
      )
    );
    return null;
  }
};

export const closeShift = async (data: any) => {
  const response = await api.post("/shift/close", data);
  if (response.data.message === "Shift is not open.") {
    await logoutService();
  }
  return response;
};

export const checkAuthorization = async (passcode: string) => {
  return api.post("/auth/check-admin-password", { admin_password: passcode });
};

export const createPaymentDiscount = async (data: any) => {
  return api.post("/order/create-with-payment", data);
};

export const logoutService = async () => {
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
};

export const cancelOrder = async (data: any) => {
  return api.post("/order/cancel", data);
};

export const getOrderById = async (orderId: string) => {
  return api.get(`/order/${orderId}`);
};

export const getClients = async () => {
  return api.get("/clients");
};

export const createClient = async (data: any) => {
  return api.post("/clients", data);
};
