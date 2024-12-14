import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OrderState = {
  selectedOrderType: 'dine-in' | 'take-away' | 'delivery' | 'own-delivery' | null;
};

const initialState: OrderState = {
  selectedOrderType: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderType: (state, action: PayloadAction<OrderState['selectedOrderType']>) => {
      state.selectedOrderType = action.payload;
    },
  },
});

export const { setOrderType } = orderSlice.actions;
export default orderSlice.reducer; 