import { api } from "@/api/axios";

export const checkOpenDay = async () => {
  return api.get("/days/check-open");
};

export const openDay = async () => {
  return api.post("/days/open");
};

export const closeDay = async (data: {
  openNewDay: boolean;
  confirmed_by: string;
}) => {
  return api.post("/days/close", data);
};
