import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface OrderState {
  waiter_id: number | null;
  coaster_call: string | null;
  urgent: boolean | false;
  shift_id: string;
  table_id: string | null;
  delivery_guy_id: string | null;
  discount: any | null;
  client_id: string | null;
  customer_count: number;
  notes: string;
  one_time: boolean;
  total_amount: number;
  order_type_id: string | null;
  orderlines: any[];
}

interface OrderSliceState {
  data: OrderState;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialOrderState: OrderState = {
  waiter_id: null,
  coaster_call: null,
  urgent: false,
  shift_id: localStorage.getItem("shift_id") || "",
  table_id: null,
  delivery_guy_id: null,
  discount: null,
  client_id: null,
  customer_count: 0,
  notes: "",
  one_time: false,
  total_amount: 0,
  order_type_id: null,
  orderlines: [],
};

const initialState: OrderSliceState = {
  data: initialOrderState,
  status: "idle",
  error: null,
};

interface UpdateOrderLinePayload {
  _id: string;
  customerIndex: number;
  orderLine: any;
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<OrderState>) => {
      state.data = action.payload;
    },
    resetOrder: (state) => {
      state.data = initialOrderState;
    },
    updateOrderLine: (state, action: PayloadAction<UpdateOrderLinePayload>) => {
      const orderLineIndex = state.data.orderlines.findIndex(
        (ol) =>
          ol._id === action.payload._id &&
          ol.customer_index === action.payload.customerIndex
      );

      if (orderLineIndex !== -1) {
        const orderLine = state.data.orderlines[orderLineIndex];
        
        // If this is a combo product
        if (orderLine.is_combo && orderLine.combo_items) {
          // Update the main combo product
          state.data.orderlines[orderLineIndex] = {
            ...orderLine,
            ...action.payload.orderLine,
            combo_items: {
              variants: orderLine.combo_items.variants.map((variant: any) => ({
                ...variant,
                notes: action.payload.orderLine.notes || variant.notes,
                suite_commande: action.payload.orderLine.suite_commande ?? variant.suite_commande,
              })),
              supplements: orderLine.combo_items.supplements.map((supplement: any) => ({
                ...supplement,
                notes: action.payload.orderLine.notes || supplement.notes,
                suite_commande: action.payload.orderLine.suite_commande ?? supplement.suite_commande,
              })),
            },
          };
        } else {
          // Regular product update
          state.data.orderlines[orderLineIndex] = {
            ...orderLine,
            ...action.payload.orderLine,
          };
        }
      }

      // Handle updates for variants within combos
      state.data.orderlines = state.data.orderlines.map(orderLine => {
        if (orderLine.is_combo && orderLine.combo_items) {
          return {
            ...orderLine,
            combo_items: {
              variants: orderLine.combo_items.variants.map((variant: any) => {
                if (variant._id === action.payload._id && 
                    orderLine.customer_index === action.payload.customerIndex) {
                  return {
                    ...variant,
                    ...action.payload.orderLine,
                  };
                }
                return variant;
              }),
              supplements: orderLine.combo_items.supplements.map((supplement: any) => {
                if (supplement._id === action.payload._id && 
                    orderLine.customer_index === action.payload.customerIndex) {
                  return {
                    ...supplement,
                    ...action.payload.orderLine,
                  };
                }
                return supplement;
              }),
            },
          };
        }
        return orderLine;
      });
    },
    addOrderLine: (state, action: PayloadAction<any[]>) => {
      state.data.orderlines = action.payload;
    },
    removeOrderLine: (state, action: PayloadAction<number>) => {
      state.data.orderlines = state.data.orderlines.filter(
        (_: any, index: number) => index !== action.payload
      );
    },
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      state.data.total_amount = action.payload;
    },
    setCustomerCount: (state, action: PayloadAction<number>) => {
      state.data.customer_count = action.payload;
    },
    setWaiterId: (state, action: PayloadAction<number | null>) => {
      state.data.waiter_id = action.payload;
    },
    setCoasterCall: (state, action: PayloadAction<string | null>) => {
      state.data.coaster_call = action.payload;
    },
    setShiftId: (state, action: PayloadAction<string>) => {
      state.data.shift_id = action.payload;
    },
    setTableId: (state, action: PayloadAction<string | null>) => {
      state.data.table_id = action.payload;
    },
    setDeliveryGuyId: (state, action: PayloadAction<string | null>) => {
      state.data.delivery_guy_id = action.payload;
    },
    setClientId: (state, action: PayloadAction<string | null>) => {
      state.data.client_id = action.payload;
    },
    setOneTime: (state, action: PayloadAction<boolean>) => {
      state.data.one_time = action.payload;
    },
    setOrderTypeId: (state, action: PayloadAction<string | null>) => {
      state.data.order_type_id = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.data.notes = action.payload;
    },
    setUrgent: (state, action: PayloadAction<boolean>) => {
      state.data.urgent = action.payload;
    },
    setDiscount: (state, action: PayloadAction<any | null>) => {
      state.data.discount = action.payload;
    },
    holdOrder: (state) => {
      const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");
      const newHoldOrder = {
        ...state.data,
        id: Date.now(), // unique identifier
        createdAt: new Date().toISOString(),
        status: "waiting",
      };

      holdOrders.push(newHoldOrder);
      localStorage.setItem("holdOrders", JSON.stringify(holdOrders));

      // Reset the current order
      state.data = initialState.data;
    },
  },
});

export const {
  holdOrder,
  setOrderData,
  resetOrder,
  updateOrderLine,
  addOrderLine,
  removeOrderLine,
  updateTotalAmount,
  setCustomerCount,
  setWaiterId,
  setCoasterCall,
  setShiftId,
  setTableId,
  setDeliveryGuyId,
  setClientId,
  setOneTime,
  setOrderTypeId,
  setNotes,
  setUrgent,
  setDiscount,
} = orderSlice.actions;

export default orderSlice.reducer;

export const selectOrder = (state: RootState) => state.createOrder.data;
export const selectOrderStatus = (state: RootState) => state.createOrder.status;
export const selectOrderError = (state: RootState) => state.createOrder.error;
export const selectOrderLines = (state: RootState) =>
  state.createOrder.data.orderlines;
export const selectTotalAmount = (state: RootState) =>
  state.createOrder.data.total_amount;
