import type { AppDispatch } from "@/store";
import { fetchUsers } from "@/store/slices/data/usersSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Passcode from "./components/Passcode";
import SelectUser from "./components/SelectUser";

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
