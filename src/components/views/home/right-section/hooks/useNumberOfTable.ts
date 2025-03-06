import { getByTableName } from "@/api/services";
import { getFloors } from "@/api/services/floors.service";
import { updateOrder as updateNewOrder } from "@/api/services/order.service";
import { updateOrder } from "@/functions/updateOrder";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Floor } from "@/interfaces/table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ALL_CATEGORIES_VIEW } from "../../left-section/constants";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";

type TableValidState = "valid" | "invalid" | "not-found";

export const useNumberOfTable = () => {
  const { tableNumber, setTableNumber, setViews } = useRightViewContext();
  const { setViews: setLeftView } = useLeftViewContext();
  const [tableValid, setTableValid] = useState<TableValidState>("valid");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [floors, setFloors] = useState<Floor[]>([]);

  useEffect(() => {
    const fetchAllFloors = async () => {
      const response = await getFloors();
      setFloors(response.data);
    };
    fetchAllFloors();
  }, []);

  const [loadedOrder, setLoadedOrder] = useLocalStorage<any>("loadedOrder", {});
  // Ensure tableNumber is handled as a string by using an empty string default
  const [_, setTableNumberFromLS] = useLocalStorage<string>("tableNumber", "");

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
      // Convert to number to check limit, then keep as string
      setTableNumber(parseInt(newValue) <= 999999 ? newValue : tableNumber);
    }
  };

  const findTableByName = (tableName: string) => {
    return Object.values(floors)
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

    if (table?.status !== "available") {
      setTableValid("invalid");
      setIsLoading(false);
      return;
    }

    try {
      if (!loadedOrder._id) {
        const response = await getByTableName(number);
        if (response.status === 204 || response.status === 200) {
          dispatch(updateOrder({ table_id: tableId }));
          setTableNumberFromLS(number);
          setTableNumber(number);
          setViews(ORDER_SUMMARY_VIEW);
          setLeftView(ALL_CATEGORIES_VIEW);
          setTableValid("valid");
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
          setLeftView(ALL_CATEGORIES_VIEW);
        }
      }
    } catch (error) {
      console.error("Error confirming table:", error);
      setTableValid("not-found");
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationMessage = () => {
    switch (tableValid) {
      case "invalid":
        return "Table is already taken or not available";
      case "not-found":
        return "Table not found";
      default:
        return "";
    }
  };

  const handleCancel = () => {
    setViews(TYPE_OF_ORDER_VIEW);
    setLeftView(ALL_CATEGORIES_VIEW);
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
