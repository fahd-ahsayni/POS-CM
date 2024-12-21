import { api } from "@/api/axios";

export const getByTableName = async (tableName: string) => {
  return api.get(`/order/by-table-name/${tableName}`);
};

export const openCashDrawer = async (shiftId: string) => {
  return api.post("/pos/open-cashdrawer", { shift_id: shiftId });
};

export const openShift = async (startingBalance: string, posId: string) => {
  return api.post("/shift/open", {
    starting_balance: startingBalance,
    pos_id: posId,
  });
};
