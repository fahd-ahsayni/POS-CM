import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOrdersByDay } from "@/api/services";
import { Order } from "@/types/getDataByDay";

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

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  try {
    const response = await getOrdersByDay();
    return response.data;
  } catch (error: any) {
    throw error;
  }
});
export const refreshOrders = createAsyncThunk(
  "orders/refreshOrders",
  async () => {
    try {
      const response = await getOrdersByDay();
      return response.data;
    } catch (error: any) {
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
    resetPagination(state) {
      state.currentPage = 0;
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
      })
      .addCase(refreshOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.currentPage = 0;
      })
      .addCase(refreshOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to refresh orders";
      });
  },
});

export const { setPageSize, setCurrentPage, resetPagination } =
  ordersSlice.actions;
export default ordersSlice.reducer;
