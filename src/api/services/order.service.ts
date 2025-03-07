import { api } from "@/api/axios";


export const getByTableName = async (tableName: string) => {
  return api.get(`/order/by-table-name/${tableName}`);
};

export const createOrder = async (data: any) => {
  return api.post("/order/create", data);
};

export const updateOrder = async (data: any, orderId: string) => {
  // Make sure orderlines with combo items are properly structured
  if (data.orderlines) {
    data.orderlines = data.orderlines.map((line: any) => {
      // Ensure combo_prod_ids and combo_supp_ids are included if they exist
      const cleanedLine = { ...line };

      // Remove undefined or null properties
      Object.keys(cleanedLine).forEach((key) => {
        if (cleanedLine[key] === undefined || cleanedLine[key] === null) {
          delete cleanedLine[key];
        }
      });

      return cleanedLine;
    });
  }

  return api.patch(`/order/update/${orderId}`, data);
};

export const getOrdersByDay = async () => {
  return api.get("/order/by-day");
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

export const getOrderByTableId = async (tableId: string) => {
  return api.get(`/order/by-table/${tableId}`);
};
