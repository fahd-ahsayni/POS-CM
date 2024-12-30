import { getByTableName } from "@/api/services";
import { updateOrder } from "@/functions/updateOrder";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";

type TableValidState = "valid" | "invalid" | "not-found";

export const useNumberOfTable = () => {
  const { tableNumber, setTableNumber, setViews } = useRightViewContext();
  const [tableValid, setTableValid] = useState<TableValidState>("valid");
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem("generalData") || "{}").floors;

  useEffect(() => {
    setTableValid("valid");
  }, [tableNumber]);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setTableNumber("");
    } else if (value === "delete") {
      setTableNumber(tableNumber.slice(0, -1));
    } else {
      const newValue = tableNumber + value;
      setTableNumber(parseInt(newValue) <= 999999 ? newValue : tableNumber);
    }
  };

  const findTableByName = (tableName: string) => {
    return Object.values(data)
      .map((floor: any) =>
        floor.table_ids?.filter((table: any) => table.name === tableName)
      )
      .flat()
      .find((table: any) => table);
  };

  const handleConfirm = async (number: string) => {
    try {
      const response = await getByTableName(number);

      if (response.status === 204) {
        const tableId = findTableByName(number)?._id;
        dispatch(updateOrder({ table_id: tableId }));
        setTableValid("valid");
        setTableNumber(number);
        setViews(ORDER_SUMMARY_VIEW);
      } else if (response.status === 200) {
        setTableValid("invalid");
      }
    } catch (error) {
      setTableValid("not-found");
    }
  };

  const getValidationMessage = () => {
    switch (tableValid) {
      case "invalid":
        return "Table is already taken";
      case "not-found":
        return "Table not found";
      default:
        return "";
    }
  };

  const handleCancel = () => {
    setViews(TYPE_OF_ORDER_VIEW);
  };

  return {
    tableNumber,
    tableValid,
    handleNumberClick,
    handleConfirm,
    handleCancel,
    getValidationMessage,
  };
};
