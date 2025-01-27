import { api } from "@/api/axios";

export const openCashDrawer = async (shiftId: string) => {
  return api.post("/pos/open-cashdrawer", { shift_id: shiftId });
};

export const getGeneralData = async (posId: string) => {
  return api.get(`/general-data/pos/${posId}`);
}; 