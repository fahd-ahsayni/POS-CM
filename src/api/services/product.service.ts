import { api } from "@/api/axios";

export const checkProductAvailability = async (productId: string) => {
  return api.get(`/product/check-availability/${productId}`);
};

export const getCategories = async (id?: string) => {
  if (id) {
    return api.get(`/categories/${id}`);
  }
  return api.get("/categories");
};