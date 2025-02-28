import { api } from "../axios";

export const getFloors = () => {
  return api.get("/floors");
};
