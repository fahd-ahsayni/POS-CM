import { api } from "@/api/axios";
import { Client } from "@/interfaces/clients";

export interface ClientFormData {
  name: string;
  phone: string;
  address: string;
  email?: string;
  ice?: string;
}

export const getClients = async (): Promise<{ data: Client[] }> => {
  return api.get("/clients");
};

export const getClientById = async (id: string): Promise<{ data: Client }> => {
  return api.get(`/clients/${id}`);
};

export const createClient = async (data: ClientFormData): Promise<{ data: { client: Client } }> => {
  return api.post("/clients", data);
};

export const updateClient = async (id: string, data: ClientFormData): Promise<{ data: Client }> => {
  return api.put(`/clients/${id}`, data);
};