import { api } from "@/api/axios";

export class ClientService {
  static async getAll() {
    return api.get("/clients");
  }

  static async create(data: any) {
    return api.post("/clients", data);
  }

  static async update(id: string, data: any) {
    return api.put(`/clients/${id}`, data);
  }
} 