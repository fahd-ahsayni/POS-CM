import { updateOrder } from "@/functions/updateOrder";
import { getByTableName } from "@/api/services";
import { updateOrder as updateNewOrder } from "@/api/services/order.service";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useLocalStorage } from "@/hooks/use-local-storage";

type TableValidState = "valid" | "invalid" | "not-found";

export const useNumberOfTable = () => {
  const { tableNumber, setTableNumber, setViews } = useRightViewContext();
  const [tableValid, setTableValid] = useState<TableValidState>("valid");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem("generalData") || "{}").floors;

  const [loadedOrder, setLoadedOrder] = useLocalStorage<any>("loadedOrder", {});
  const [_, setTableNumberFromLS] = useLocalStorage<any>("tableNumber", 0);

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
    setIsLoading(true);
    const table = findTableByName(number);
    const tableId = table?._id;
    if (!tableId) {
      setTableValid("not-found");
      setIsLoading(false);
      return;
    }

    try {
      if (!loadedOrder._id) {
        const response = await getByTableName(number);
        if (response.status === 204) {
          dispatch(updateOrder({ table_id: tableId }));
          setTableNumberFromLS(number);
          setTableNumber(number);
          setViews(ORDER_SUMMARY_VIEW);
          setTableValid("valid");
        } else if (response.status === 200) {
          setTableValid("invalid");
        }
      } else if (loadedOrder._id) {
        const response = await updateNewOrder(
          { table_id: tableId },
          loadedOrder._id
        );
        if (response.status === 200) {
          setTableNumberFromLS(number);
          setTableNumber(number);
          setLoadedOrder(response.data);
          setViews(ORDER_SUMMARY_VIEW);
        }
      }
    } catch (error) {
      setTableValid("not-found");
    } finally {
      setIsLoading(false);
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
    isLoading,
    handleNumberClick,
    handleConfirm,
    handleCancel,
    getValidationMessage,
    setTableNumber,
  };
};
