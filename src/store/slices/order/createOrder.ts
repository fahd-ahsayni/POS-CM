import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface OrderState {
  waiter_id: number | null;
  coaster_call: boolean | null;
  urgent: boolean | null;
  shift_id: string | null;
  table_id: string | null;
  delivery_guy_id: string | null;
  discount_amount: number | null;
  client_id: string | null;
  customer_count: number;
  notes: string[];
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
  urgent: null,
  shift_id: null,
  table_id: null,
  delivery_guy_id: null,
  discount_amount: null,
  client_id: null,
  customer_count: 0,
  notes: [],
  one_time: false,
  total_amount: 0,
  order_type_id: null,
  orderlines: [],
};

console.log("Initializing order state:", initialOrderState);

const initialState: OrderSliceState = {
  data: initialOrderState,
  status: "idle",
  error: null,
};

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
    updateOrderLine: (
      state,
      action: PayloadAction<{ id: number; orderLine: any }>
    ) => {
      const orderLineIndex = state.data.orderlines.findIndex(
        (ol) => ol.id === action.payload.id
      );
      if (orderLineIndex !== -1) {
        console.log(
          `Order line ${action.payload.id} updated:`,
          action.payload.orderLine
        );
        state.data.orderlines[orderLineIndex] = action.payload.orderLine;
      }
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
    setCoasterCall: (state, action: PayloadAction<boolean | null>) => {
      state.data.coaster_call = action.payload;
    },
    setShiftId: (state, action: PayloadAction<string | null>) => {
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
    setNotes: (state, action: PayloadAction<string[]>) => {
      state.data.notes = action.payload;
    },
    setUrgent: (state, action: PayloadAction<boolean | null>) => {
      state.data.urgent = action.payload;
    },
    setDiscountAmount: (state, action: PayloadAction<number | null>) => {
      state.data.discount_amount = action.payload;
    },
  },
});

export const {
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
  setDiscountAmount,
} = orderSlice.actions;

export default orderSlice.reducer;

export const selectOrder = (state: RootState) => state.createOrder.data;
export const selectOrderStatus = (state: RootState) => state.createOrder.status;
export const selectOrderError = (state: RootState) => state.createOrder.error;
export const selectOrderLines = (state: RootState) =>
  state.createOrder.data.orderlines;
export const selectTotalAmount = (state: RootState) =>
  state.createOrder.data.total_amount;
