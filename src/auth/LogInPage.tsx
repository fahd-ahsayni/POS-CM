import type { AppDispatch } from "@/store";
import { fetchUsers } from "@/store/slices/data/usersSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Passcode from "./components/Passcode";
import SelectUser from "./components/SelectUser";
import { useTheme } from "@/providers/themeProvider";

export default function LogInPage() {
  const dispatch = useDispatch<AppDispatch>();

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
