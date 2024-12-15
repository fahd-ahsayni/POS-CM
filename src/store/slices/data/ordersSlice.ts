import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  pageSize: 10,
  currentPage: 0,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get("http://localhost:3001/orders");
  return response.data;
});

const ordersSlice = createSlice({
  name: 'orders',
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
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { setPageSize, setCurrentPage } = ordersSlice.actions;
export default ordersSlice.reducer;