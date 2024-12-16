import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const ORDERS_API_URL = import.meta.env.VITE_API_ORDERS;

interface Order {
  id: number;
  orderId: string;
  dateTime: string;
  orderedBy: string;
  orderType: string;
  deliveryPerson: string;
  paymentStatus: string;
  orderTotal: number;
}

interface OrdersState {
  orders: Order[];
  pageSize: number;
  currentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  pageSize: 10,
  currentPage: 0,
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found - please log in first");
    }
    console.log("Token when fetching orders:", token); // Debug log
    console.log("Full Authorization header:", `Bearer ${token}`); // Debug log

    try {
      const response = await axios.get(ORDERS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Orders API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Error fetching orders:", error);
      console.log("Error response data:", error.response?.data); // Add this to see server error message
      throw error;
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export const { setPageSize, setCurrentPage } = ordersSlice.actions;
export default ordersSlice.reducer;
