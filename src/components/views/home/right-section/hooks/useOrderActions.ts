import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateOrder } from "@/functions/updateOrder";

export const useOrderActions = () => {
  const dispatch = useDispatch();

  const updateOrderField = useCallback(
    (field: string, value: any) => {
      dispatch(updateOrder({ [field]: value }));
    },
    [dispatch]
  );

  const handleOrderTypeChange = useCallback(
    (type: string) => {
      updateOrderField("order_type_id", type);
    },
    [updateOrderField]
  );

  const handleUrgentToggle = useCallback(
    (value: boolean) => {
      updateOrderField("urgent", value);
    },
    [updateOrderField]
  );

  const handleOneTimeToggle = useCallback(
    (value: boolean) => {
      updateOrderField("one_time", value);
    },
    [updateOrderField]
  );

  return {
    updateOrderField,
    handleOrderTypeChange,
    handleUrgentToggle,
    handleOneTimeToggle,
  };
};
