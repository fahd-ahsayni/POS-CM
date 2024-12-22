import SelectPosPage from "@/auth/SelectPosPage";
import Layout from "@/components/Layout/Layout";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import OrdersPage from "./OrdersPage";
import { useEffect } from "react";
import { useTheme } from "@/providers/themeProvider";

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
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  }, []);
  return (
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
      </Route>
    </Routes>
  );
}
