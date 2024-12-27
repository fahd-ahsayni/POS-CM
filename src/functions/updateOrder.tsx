import {
  addOrderLine,
  removeOrderLine,
  setClientId,
  setCoasterCall,
  setCustomerCount,
  setDeliveryGuyId,
  setOneTime,
  setOrderTypeId,
  setShiftId,
  setTableId,
  setWaiterId,
  updateOrderLine,
  updateTotalAmount,
} from "../store/slices/order/createOrder"; // Adjust path as needed

type OrderUpdateParams = {
  waiter_id?: number | null;
  coaster_call?: boolean | null;
  shift_id?: string | null;
  table_id?: string | null;
  delivery_guy_id?: string | null;
  client_id?: string | null;
  customer_count?: number;
  one_time?: boolean;
  total_amount?: number;
  order_type_id?: string | null;
  orderlines?: {
    action: "add" | "update" | "remove";
    data: any;
    id?: number;
  }[];
};

export const updateOrder = (params: OrderUpdateParams): any => {
  return (dispatch: any) => {
    Object.entries(params).forEach(([key, value]) => {
      switch (key) {
        case "waiter_id":
          dispatch(setWaiterId(value as number | null));
          break;
        case "coaster_call":
          dispatch(setCoasterCall(value as boolean | null));
          break;
        case "shift_id":
          console.log("value", value);
          dispatch(setShiftId(value as string | null));
          break;
        case "table_id":
          dispatch(setTableId(value as string | null));
          break;
        case "delivery_guy_id":
          dispatch(setDeliveryGuyId(value as string | null));
          break;
        case "client_id":
          dispatch(setClientId(value as string | null));
          break;
        case "customer_count":
          dispatch(setCustomerCount(value as number));
          break;
        case "one_time":
          dispatch(setOneTime(value as boolean));
          break;
        case "total_amount":
          dispatch(updateTotalAmount(value as number));
          break;
        case "order_type_id":
          dispatch(setOrderTypeId(value as string | null));
          break;
        case "orderlines":
          if (value && Array.isArray(value) && value.length > 0) {
            value!.forEach((orderlineOp) => {
              switch (orderlineOp.action) {
                case "add":
                  if (orderlineOp.data) {
                    dispatch(addOrderLine(orderlineOp.data));
                  }
                  break;
                case "update":
                  if (orderlineOp.id !== undefined) {
                    dispatch(
                      updateOrderLine({
                        id: orderlineOp.id,
                        orderLine: orderlineOp.data,
                      })
                    );
                  }
                  break;
                case "remove":
                  if (orderlineOp.id !== undefined) {
                    dispatch(removeOrderLine(orderlineOp.id));
                  }
                  break;
              }
            });
          }
          break;

        default:
          console.warn(`Unknown order field: ${key}`);
      }
    });
  };
};
