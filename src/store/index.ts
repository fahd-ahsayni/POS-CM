import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/data/userSlice';
import orderSelectionReducer from '@/store/slices/pages/SelectOrderSlice';
import ordersReducer from '@/store/slices/data/ordersSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    orderSelection: orderSelectionReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 