import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/data/usersSlice";
import ordersReducer from "@/store/slices/data/ordersSlice";
import authReducer from "@/store/slices/authentication/authSlice";
import { categoriesViewSlice } from "@/store/slices/views/categoriesViewSlice";
import orderSelectionReducer from "@/store/slices/views/typeOfOrderViewsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orderSelection: orderSelectionReducer,
    orders: ordersReducer,
    categoriesView: categoriesViewSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
