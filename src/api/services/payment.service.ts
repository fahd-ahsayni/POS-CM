import { api } from "@/api/axios";

export const createPayment = async (data: any) => {
  return api.post("/order/create-with-payment", data);
};

export const payOrderWithoutSelectedProduct = async (data: {
  order_id: string;
  payments: any[];
  shift_id: string;
}) => {
  return api.post("/payment/payments", data);
};

export const paySelectedProducts = async (data: {
  orderlines: string[];
  order_id: string;
  payments: any[];
  shift_id: string;
}) => {
  return api.post("/payment", data);
};

export const dropCash = async (data: any) => {
  return api.post("/drop", data);
};
