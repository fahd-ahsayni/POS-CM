import { Button } from "@/components/ui/button";
import CirclesAnimation from "./CirclesAnimation";
import { useState, useMemo } from "react";
import NumberPad from "@/components/global/NumberPad";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/authentication/authSlice";
import { RootState, AppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { setSelectedUser } from "@/store/slices/data/usersSlice";

export default function Passcode() {
  const [passcode, setPasscode] = useState<string>("");
  const [incorrectPasscode, setIncorrectPasscode] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get the selected user from the Redux store
  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );
  const loading = useSelector((state: RootState) => state.auth.loading);
  const users = useSelector((state: RootState) => state.users.users);

  const shuffledNumbers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ),
    []
  );

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setPasscode("");
    } else if (value === "delete") {
      setPasscode((prev) => prev.slice(0, -1));
    } else if (passcode.length < 6) {
      setPasscode((prev) => prev + value);
    }
  };

  const handleLogin = async () => {
    if (!selectedUser) {
      console.log("No user selected");
      return;
    }

    if (!selectedUser.id) {
      console.log("User ID is undefined");
      return;
    }

    try {
      const result = await dispatch(
        login({
          id: selectedUser.id.toString(),
          passcode: passcode,
        })
      ).unwrap();

      navigate("/select-pos");
      dispatch(setSelectedUser(users.cashiers[0]));
    } catch (error) {
      console.error("Login failed:", error);
      setIncorrectPasscode(true);
      setPasscode("");
    }
  };

  return (
    <div className="flex lg:w-1/2 w-full h-full bg-zinc-950 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
      <div className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30" />
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
            Enter Passcode
          </h2>
          <p className="mt-1 text-sm text-zinc-300">
            Securely authenticate to access the POS system.
          </p>
        </div>
        <div className="mt-10">
          <CirclesAnimation
            currentLength={passcode.length}
            incorrectPasscode={incorrectPasscode}
          />
        </div>
        <div className="mt-10 min-w-full px-20">
          <NumberPad
            onNumberClick={handleNumberClick}
            numbers={shuffledNumbers}
          />
        </div>
        <div className="mt-10">
          <Button onClick={handleLogin} className="w-full">
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
