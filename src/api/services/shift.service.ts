import { AuthService } from './auth.service';
import { api } from "@/api/axios";

export interface ShiftOpenData {
  starting_balance: string;
  pos_id: string;
}

export class ShiftService {
  static async openShift(startingBalance: string, posId: string) {
    return api.post("/shift/open", {
      starting_balance: startingBalance,
      pos_id: posId,
    });
  }

  static async closeShift(data: any) {
    const response = await api.post("/shift/close", data);
    if (response.data.message === "Shift is not open.") {
      await AuthService.logout();
    }
    return response;
  }

  static async updateShift(data: any, shiftId: string) {
    return api.put(`/shift/update/${shiftId}`, data);
  }

  static async openCashDrawer(shiftId: string) {
    return api.post("/pos/open-cashdrawer", { shift_id: shiftId });
  }

  static async dropCash(data: any) {
    return api.post("/drop", data);
  }
} 