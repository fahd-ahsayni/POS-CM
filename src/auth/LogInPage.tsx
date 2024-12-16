import SelectUser from "./components/SelectUser";
import Passcode from "./components/Passcode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/store/slices/data/usersSlice";
import type { AppDispatch } from "@/store";

export default function LogInPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <>
      <div className="flex h-screen min-w-screen overflow-hidden">
        <SelectUser />
        <Passcode />
      </div>
    </>
  );
}
