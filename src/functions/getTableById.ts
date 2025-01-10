import { Table } from "@/types/tables";

export function getTableById(tableId: string): Table | null {
  const floors = JSON.parse(localStorage.getItem("floors") || "[]").floors;

  if (!floors) return null;

  for (const floor of floors) {
    const foundTable = floor.table_ids.find(
      (table: Table) => table._id === tableId
    );
    if (foundTable) {
      return foundTable;
    }
  }
  return null;
}
