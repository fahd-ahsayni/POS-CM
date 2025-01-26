import { api } from "@/api/axios";

export class ProductService {
  static async checkAvailability(productId: string) {
    return api.get(`/product/check-availability/${productId}`);
  }
} 