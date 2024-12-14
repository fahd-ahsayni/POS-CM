import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/userSlice';
import orderReducer from '@/store/slices/pages/orderSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 