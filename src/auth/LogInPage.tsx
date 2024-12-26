import type { AppDispatch } from "@/store";
import { fetchUsers } from "@/store/slices/data/usersSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Passcode from "./components/Passcode";
import SelectUser from "./components/SelectUser";
import { useTheme } from "@/providers/themeProvider";
import { useNavigate } from "react-router-dom";

export default function LogInPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  }, []);

  return (
    <>
      <div className="flex h-screen min-w-screen overflow-hidden">
        <SelectUser />
        <Passcode />
      </div>
    </>
  );
}
