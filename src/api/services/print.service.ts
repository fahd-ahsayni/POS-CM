import { api } from "@/api/axios";
import { createToast } from "@/components/global/Toasters";
import { ApiResponse } from "@/interfaces/api";
import { toast } from "react-toastify";

interface PrintOrderRequest {
  order_id: string;
  pos_id: string;
  orderline_ids?: string[];
  payment_id?: string;
}

export const printOrder = async (
  orderId: string,
  orderlines: string[] = [],
  paymentId?: string
): Promise<ApiResponse<any> | null> => {
  try {
    const posId = localStorage.getItem("posId");
    if (!posId) {
      throw new Error("POS ID not found in local storage");
    }

    let requestData: PrintOrderRequest;

    if (orderlines) {
      requestData = {
        order_id: orderId,
        pos_id: posId,
        orderline_ids: orderlines,
      };
    } else if (paymentId) {
      requestData = {
        order_id: orderId,
        pos_id: posId,
        payment_id: paymentId,
      };
    } else {
      requestData = {
        order_id: orderId,
        pos_id: posId,
      };
    }

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
