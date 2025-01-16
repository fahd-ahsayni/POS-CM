import {
  addHoldOrder,
  removeHoldOrder,
  selectHoldOrders,
} from "@/store/slices/order/hold-orders.slice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { createToast } from "@/components/global/Toasters";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import {
  resetOrder,
  selectOrder,
} from "@/store/slices/order/create-order.slice";
import { Order } from "@/types/hold-order";
import { toast } from "react-toastify";

export const useHoldOrders = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectOrder);
  const holdOrders = useSelector(selectHoldOrders);
  const { setSelectedProducts } = useLeftViewContext();
  const { setCustomerIndex } = useRightViewContext();

  const handleHoldOrder = useCallback(() => {
    try {
      if (!currentOrder.orderlines.length) {
        toast.error(
          createToast(
            "Hold Order Failed",
            "Cannot hold an empty order",
            "error"
          )
        );
        return;
      }

      // Get data from localStorage with proper error handling
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const shiftId = localStorage.getItem("shiftId") || null;
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");

      const holdOrder: Order = {
        ...currentOrder,
        _id: uuidv4(),
        ref: `HOLD-${Date.now()}`,
        order_number: holdOrders.length + 1,
        status: "new",
        discount_amount: 0,
        number_of_place: currentOrder.customer_count || 1,
        created_by: user,
        updated_by: user._id || "null",
        archived: false,
        orderline_ids: currentOrder.orderlines || [],
        shift_id: shiftId || "",
        table_id: currentOrder.table_id,
        order_type_id: orderType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to hold orders
      dispatch(addHoldOrder(holdOrder));

      // Reset current order
      dispatch(resetOrder());
      setSelectedProducts([]);
      setCustomerIndex(1);

      toast.success(
        createToast(
          "Order Held Successfully",
          "Your order has been saved to the hold list",
          "success"
        )
      );
    } catch (error) {
      console.error("Error holding order:", error);
      toast.error(
        createToast(
          "Hold Order Failed",
          "There was an error saving your order",
          "error"
        )
      );
    }
  }, [
    currentOrder,
    holdOrders.length,
    dispatch,
    setSelectedProducts,
    setCustomerIndex,
  ]);

  const removeFromHold = useCallback(
    (orderId: string) => {
      try {
        dispatch(removeHoldOrder(orderId));
        toast.success(
          createToast(
            "Order Removed",
            "Order has been removed from hold list",
            "success"
          )
        );
      } catch (error) {
        console.error("Error removing hold order:", error);
        toast.error(
          createToast(
            "Remove Failed",
            "Failed to remove order from hold list",
            "error"
          )
        );
      }
    },
    [dispatch]
  );

  return {
    holdOrders,
    handleHoldOrder,
    removeFromHold,
  };
};
