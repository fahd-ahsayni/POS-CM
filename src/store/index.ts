import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/data/usersSlice";
import ordersReducer from "@/store/slices/data/ordersSlice";
import authReducer from "@/store/slices/authentication/authSlice";
import dayStatusReducer from "@/store/slices/authentication/openDaySlice";
import posReducer from "@/store/slices/data/posSlice";
import generalDataReducer from "@/store/slices/data/generalDataSlice";
import createOrderReducer from "@/store/slices/order/createOrder";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orders: ordersReducer,
    dayStatus: dayStatusReducer,
    pos: posReducer,
    generalData: generalDataReducer,
    createOrder: createOrderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
