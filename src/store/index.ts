import authReducer from "@/store/slices/authentication/auth.slice";
import dayStatusReducer from "@/store/slices/authentication/open.day.slice";
import generalDataReducer from "@/store/slices/data/general-data.slice";
import ordersReducer from "@/store/slices/data/orders.slice";
import posReducer from "@/store/slices/data/pos.slice";
import userReducer from "@/store/slices/data/users.slice";
import createOrderReducer from "@/store/slices/order/create-order.slice";
import holdOrdersReducer from './slices/order/hold-orders.slice';
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orders: ordersReducer,
    dayStatus: dayStatusReducer,
    pos: posReducer,
    generalData: generalDataReducer,
    createOrder: createOrderReducer,
    holdOrders: holdOrdersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
