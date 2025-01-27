import { api } from "@/api/axios";

export const checkOpenDay = async () => {
  return api.get("/days/check-open");
};

export const openDay = async () => {
  return api.post("/days/open");
}; 