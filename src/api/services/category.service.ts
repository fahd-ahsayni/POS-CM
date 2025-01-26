import { api } from "@/api/axios";

export class CategoryService {
  static async getCategories(id?: string) {
    if (id) {
      return api.get(`/categories/${id}`);
    }
    return api.get("/categories");
  }
} 