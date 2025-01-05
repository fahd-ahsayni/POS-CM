import { ProductSelected } from "@/types";
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
  updateTotalAmount,
  setNotes,
  setUrgent,
  setDiscount,
} from "../store/slices/order/createOrder";

/**
 * Represents the possible operations that can be performed on order lines
 */

/**
 * Parameters for updating an order
 * @typedef {Object} OrderUpdateParams
 */
type OrderLineOperation = {
  action: "add" | "update" | "remove";
  data?: ProductSelected;
  id?: string;
};

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
  orderlines?: OrderLineOperation[];
  notes?: string[];
  urgent?: boolean | null;
  discount_id?: any | null;
};

/**
 * Updates an order with the provided parameters
 * @param {OrderUpdateParams} params - The parameters to update the order
 * @returns {Function} A Redux thunk action creator
 * @throws {Warning} Logs a warning for unknown order fields
 */
export const updateOrder = (params: OrderUpdateParams): any => {
  return (dispatch: any) => {
    Object.entries(params).forEach(([key, value]) => {
      switch (key) {
        case "waiter_id":
          dispatch(setWaiterId(value as number | null));
          break;
        case "coaster_call":
          dispatch(setCoasterCall(value as string | null));
          break;
        case "shift_id":
          dispatch(setShiftId(value as string));
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
            (value as OrderLineOperation[]).forEach((orderlineOp) => {
              switch (orderlineOp.action) {
                case "add":
                  if (orderlineOp.data) {
                    dispatch(addOrderLine([orderlineOp.data]));
                  }
                  break;
                case "remove":
                  if (orderlineOp.id !== undefined) {
                    dispatch(removeOrderLine(parseInt(orderlineOp.id)));
                  }
                  break;
              }
            });
          }
          break;
        case "notes":
          dispatch(setNotes(value as string));
          break;
        case "urgent":
          dispatch(setUrgent(value as boolean));
          break;
        case "discount_id":
          dispatch(setDiscount(value as any | null));
          break;
        default:
          console.warn(`Unknown order field: ${key}`);
      }
    });
  };
};
