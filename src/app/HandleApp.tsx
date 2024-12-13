import { Route, Routes } from "react-router-dom";
import LogInPage from "../auth/LogInPage";
import HomePage from "./HomePage";
import Layout from "@/components/Layout/layout";

export default function HandleApp() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}
