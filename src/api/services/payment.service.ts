import { api } from "@/api/axios";

export class PaymentService {
  static async createPayment(data: any) {
    return api.post("/payment/payments", data);
  }
} 