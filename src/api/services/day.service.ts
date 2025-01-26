import { api } from "@/api/axios";

export class DayService {
  static async checkOpenDay() {
    return api.get("/days/check-open");
  }

  static async openDay() {
    return api.post("/days/open");
  }
} 