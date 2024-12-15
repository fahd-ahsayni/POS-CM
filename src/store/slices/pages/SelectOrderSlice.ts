import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OrderSelectionState = {
  selectedOrderType: 'dineIn' | 'takeAway' | 'delivery' | 'ownDelivery' | 'tableConfirmation' | null;
};

const initialOrderSelectionState: OrderSelectionState = {
  selectedOrderType: null,
};

export const orderSelectionSlice = createSlice({
  name: 'orderSelection',
  initialState: initialOrderSelectionState,
  reducers: {
    setSelectedOrderType: (state, action: PayloadAction<OrderSelectionState['selectedOrderType']>) => {
      state.selectedOrderType = action.payload;
    },
  },
});

export const { setSelectedOrderType } = orderSelectionSlice.actions;
export default orderSelectionSlice.reducer; 