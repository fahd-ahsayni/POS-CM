import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/types";
import {
  CHANGE_TYPE_OF_ORDER_VIEW,
  CHANGE_COASTER_CALL_VIEW,
  CHANGE_NUMBER_OF_TABLE_VIEW,
  CHANGE_DELIVERY_VIEW,
} from "../constants";

export const useChangeOrderType = (setOpen: (open: boolean) => void) => {
  const [drawerView, setDrawerView] = useState(CHANGE_TYPE_OF_ORDER_VIEW);
  const dispatch = useDispatch();

  const handleOrderTypeSelect = useCallback(
    (orderType: OrderType) => {
      const type = orderType.type.toLowerCase();

      dispatch(updateOrder({ order_type_id: orderType._id }));
      localStorage.setItem("orderType", JSON.stringify(orderType));

      switch (type) {
        case "takeaway":
          setDrawerView(CHANGE_COASTER_CALL_VIEW);
          break;
        case "onplace":
          setDrawerView(CHANGE_NUMBER_OF_TABLE_VIEW);
          break;
        case "delivery":
          setDrawerView(CHANGE_DELIVERY_VIEW);
          break;
        default:
          setOpen(false);
      }
    },
    [dispatch, setDrawerView, setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setDrawerView(CHANGE_TYPE_OF_ORDER_VIEW);
  }, [setOpen]);

  return {
    drawerView,
    setDrawerView,
    handleOrderTypeSelect,
    handleClose,
  };
};
