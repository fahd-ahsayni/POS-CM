import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/data/usersSlice";
import ordersReducer from "@/store/slices/data/ordersSlice";
import authReducer from "@/store/slices/authentication/authSlice";
import { categoriesViewSlice } from "@/store/slices/views/categoriesViewSlice";
import orderSelectionReducer from "@/store/slices/views/typeOfOrderViewsSlice";
import dayStatusReducer from "@/store/slices/authentication/openDaySlice";
import posReducer from "@/store/slices/data/posSlice";
import generalDataReducer from "@/store/slices/data/generalDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orderSelection: orderSelectionReducer,
    orders: ordersReducer,
    categoriesView: categoriesViewSlice.reducer,
    dayStatus: dayStatusReducer,
    pos: posReducer,
    generalData: generalDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
