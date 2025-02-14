import { api } from "@/api/axios";
import { logoutService } from "./auth.service";

export interface ShiftOpenData {
  starting_balance: string;
  pos_id: string;
}

export const openShift = async (startingBalance: string, posId: string) => {
  return api.post("/shift/open", {
    starting_balance: startingBalance,
    pos_id: posId,
  });
};

export const updateShift = async (data: any, shiftId: string) => {
  return api.put(`/shift/update/${shiftId}`, data);
};

export const closeShift = async (data: any) => {
  const response = await api.post("/shift/close", data);
  if (response.data.message === "Shift is not open.") {
    await logoutService();
  }
  return response;
};

export class ShiftService {
  static async openCashDrawer(shiftId: string) {
    return api.post("/pos/open-cashdrawer", { shift_id: shiftId });
  }

  static async dropCash(data: any) {
    return api.post("/drop", data);
  }
}

export const printRAZ = () => {
  return api.get("/pos-raz/waiters");
};
