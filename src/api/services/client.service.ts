import { api } from "@/api/axios";

export const getClients = async () => {
  return api.get("/clients");
};

export const createClient = async (data: any) => {
  return api.post("/clients", data);
};

export const updateClient = async (id: string, data: any) => {
  return api.put(`/clients/${id}`, data);
}; 