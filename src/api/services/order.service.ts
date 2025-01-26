import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { toast } from "react-toastify";
import { ApiResponse } from "@/types/api";

export interface PrintOrderRequest {
  order_id: string;
  pos_id: string;
  orderlines_ids?: string[];
}

export class OrderService {
  static async getByTableName(tableName: string) {
    return api.get(`/order/by-table-name/${tableName}`);
  }

  static async create(data: any) {
    return api.post("/order/create", data);
  }

  static async update(data: any, orderId: string) {
    return api.patch(`/order/update/${orderId}`, data);
  }

  static async getOrdersByDay() {
    return api.get("/order/by-day");
  }

  static async printOrder(orderId: string, orderlines: string[] = []): Promise<ApiResponse<any> | null> {
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

      const message = response.status === 200
        ? ["Order printed successfully", "The order has been sent to the printer", "success"] as const
        : ["Failed to print order", "Please check the printer connection", "error"] as const;

      toast[message[2]](createToast(message[0], message[1], message[2]));
      return response;
    } catch (error) {
      toast.error(createToast(
        "Error printing order",
        "An unexpected error occurred while trying to print the order",
        "error"
      ));
      return null;
    }
  }

  static async createWithPayment(data: any) {
    return api.post("/order/create-with-payment", data);
  }

  static async createWithoutPayment(data: any) {
    return api.post("/order/create", data);
  }

  static async cancel(data: any) {
    return api.post("/order/cancel", data);
  }

  static async getById(orderId: string) {
    return api.get(`/order/${orderId}`);
  }

  static async checkNewOrders(shiftId: string) {
    return api.get(`/order/check-new-order/${shiftId}`);
  }

  static async filterByTableNumber(tableNumber: string | number) {
    return api.get(`/order/by-table-name/${tableNumber}`);
  }
} 