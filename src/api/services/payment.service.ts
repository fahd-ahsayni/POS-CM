import { api } from "@/api/axios";

export const createPayment = async (data: any) => {
  return api.post("/order/create-with-payment", data);
};

export const payNewOrder = async (data: any) => {
  return api.post("/payment/payments", data);
};

export const paySelectedProducts = async (data: {
  orderlines: string[];
  order_id: string;
  payment_method_id: string;
  amount_given: number;
  shift_id: string;
}) => {
  return api.post("/payement", data);
};

export const dropCash = async (data: any) => {
  return api.post("/drop", data);
};
