import { Route, Routes } from "react-router-dom";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import Layout from "@/components/Layout/Layout";
import SelectPosPage from "@/auth/SelectPosPage";
import OrdersPage from "./OrdersPage";

export default function HandleApp() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/select-pos" element={<SelectPosPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </>
  );
}
