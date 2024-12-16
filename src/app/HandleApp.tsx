import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import Layout from "@/components/Layout/Layout";
import SelectPosPage from "@/auth/SelectPosPage";
import OrdersPage from "./OrdersPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function HandleApp() {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
      <Route path="/select-pos" element={
        <ProtectedRoute>
          <SelectPosPage />
        </ProtectedRoute>
      } />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}
