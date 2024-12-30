import SelectPosPage from "@/auth/SelectPosPage";
import Layout from "@/components/Layout/Layout";
import { useTheme } from "@/providers/themeProvider";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import OrdersPage from "./OrdersPage";
import WaitingOrders from "./WaitingOrders";
import { useEffect } from "react";
import { fetchOrders } from "@/store/slices/data/ordersSlice";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const token = localStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function HandleApp() {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(fetchOrders());
  // }, []);

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme={theme}
        transition={Bounce}
        closeButton={false}
      />
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route
          path="/select-pos"
          element={
            <ProtectedRoute>
              <SelectPosPage />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/waiting-orders" element={<WaitingOrders />} />
        </Route>
      </Routes>
    </>
  );
}
