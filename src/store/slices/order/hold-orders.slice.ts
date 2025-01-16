import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../..";
import { Order } from "@/types/hold-order";

interface HoldOrdersState {
  orders: Order[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Load initial state from localStorage
const loadInitialState = (): HoldOrdersState => {
  try {
    const savedOrders = localStorage.getItem("holdOrders");
    return {
      orders: savedOrders ? JSON.parse(savedOrders) : [],
      status: "idle",
      error: null,
    };
  } catch (error) {
    console.error("Error loading hold orders from localStorage:", error);
    return {
      orders: [],
      status: "idle",
      error: null,
    };
  }
};

const holdOrdersSlice = createSlice({
  name: "holdOrders",
  initialState: loadInitialState(),
  reducers: {
    addHoldOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      localStorage.setItem("holdOrders", JSON.stringify(state.orders));
    },
    removeHoldOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
      localStorage.setItem("holdOrders", JSON.stringify(state.orders));
    },
    updateHoldOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (order) => order._id === action.payload._id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
        localStorage.setItem("holdOrders", JSON.stringify(state.orders));
      }
    },
    clearHoldOrders: (state) => {
      state.orders = [];
      localStorage.removeItem("holdOrders");
    },
  },
});

export const {
  addHoldOrder,
  removeHoldOrder,
  updateHoldOrder,
  clearHoldOrders,
} = holdOrdersSlice.actions;

// Selectors
export const selectHoldOrders = (state: RootState) => state.holdOrders.orders;
export const selectHoldOrdersStatus = (state: RootState) =>
  state.holdOrders.status;
export const selectHoldOrdersError = (state: RootState) =>
  state.holdOrders.error;

export default holdOrdersSlice.reducer;
