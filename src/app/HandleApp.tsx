import SelectPosPage from "@/auth/SelectPosPage";
import Layout from "@/components/Layout/Layout";
import { useTheme } from "@/providers/themeProvider";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import OrdersPage from "./OrdersPage";
import WaitingOrders from "./WaitingOrders";
import BrokenLink from "@/components/errors/BrokenLink";
import CustomerDisplay from "@/components/global/Customer-display/CustomerDisplay";
import SessionExpired from "@/components/errors/SessionExpired";
import ErrorOccurred from "@/components/errors/ErrorOccurred";
import Test from "@/Test";

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

  return (
    <>
      <ToastContainer
        position="top-left"
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
        <Route path="/customer-display" element={<CustomerDisplay />} />
        <Route path="/session-expired" element={<SessionExpired />} />
        <Route path="/error" element={<ErrorOccurred />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/"
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
        <Route path="*" element={<BrokenLink />} />
      </Routes>
    </>
  );
}
