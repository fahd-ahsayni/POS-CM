import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { toast } from "react-toastify";
import { ApiResponse } from "@/interfaces/api";

export interface PrintOrderRequest {
  order_id: string;
  pos_id: string;
  orderlines_ids?: string[];
}

export const getByTableName = async (tableName: string) => {
  return api.get(`/order/by-table-name/${tableName}`);
};

export const createOrder = async (data: any) => {
  return api.post("/order/create", data);
};

export const updateOrder = async (data: any, orderId: string) => {
  return api.patch(`/order/update/${orderId}`, data);
};

export const getOrdersByDay = async () => {
  return api.get("/order/by-day");
};

export const printOrder = async (
  orderId: string,
  orderlines: string[] = []
): Promise<ApiResponse<any> | null> => {
  try {
    const posId = localStorage.getItem("posId");
    if (!posId) {
      throw new Error("POS ID not found in local storage");
    }

    const requestData: PrintOrderRequest = {
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
            "Please check the printer connection",
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

export const createOrderWithOutPayment = async (data: any) => {
  return api.post("/order/create", data);
};

export const cancelOrder = async (data: any) => {
  return api.post("/order/cancel", data);
};

export const getOrderById = async (orderId: string) => {
  return api.get(`/order/${orderId}`);
};

export const checkIsNewOrders = async (shiftId: string) => {
  return api.get(`/order/check-new-order/${shiftId}`);
};

export const filterOrderById = async (orderId: string) => {
  return api.get(`/order/${orderId}`);
};

export const filterOrderByTableNumber = async (
  tableNumber: string | number
) => {
  return api.get(`/order/by-table-name/${tableNumber}`);
};

export const applyDiscount = async (data: any) => {
  return api.post("/order/discount", {
    order_id: data.order_id,
    discount_id: data.discount_id,
    reason: data.reason,
  });
};

export const launchSuiteCommand = async (id: string) => {
  return api.post(`/orderline/suite-ordred/${id}`);
};

export const launchSuiteCommandForComboElement = async (
  id: string,
  comboOrderlineId: string
) => {
  return api.post(`/orderline/suite/combo-orderlines/${id}`, {
    combo_orderline_id: comboOrderlineId,
  });
};

export class OrderService {
  static async createWithPayment(data: any) {
    return api.post("/order/create-with-payment", data);
  }
}
