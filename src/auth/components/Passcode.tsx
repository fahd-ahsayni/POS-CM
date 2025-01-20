import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store";
import { login } from "@/store/slices/authentication/auth.slice";
import { setSelectedUser } from "@/store/slices/data/users.slice";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CirclesAnimation from "./ui/CirclesAnimation";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { BeatLoader } from "react-spinners";
import { TypographySmall } from "@/components/ui/typography";
import { loadingColors } from "@/preferences";

export default function Passcode() {
  const [passcode, setPasscode] = useState<string>("");
  const [incorrectPasscode, setIncorrectPasscode] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Memoize selectors to prevent unnecessary re-renders
  const selectedUser = useSelector(
    useCallback((state: RootState) => state.users.selectedUser, [])
  );
  const loading = useSelector(
    useCallback((state: RootState) => state.auth.loading, [])
  );
  const users = useSelector(
    useCallback((state: RootState) => state.users.users, [])
  );

  // Memoize shuffled numbers
  const shuffledNumbers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ),
    []
  );

  // Memoize handlers
  const handleNumberClick = useCallback(
    (value: string) => {
      if (value === "C") {
        setPasscode("");
      } else if (value === "delete") {
        setPasscode((prev) => prev.slice(0, -1));
      } else if (passcode.length < 6) {
        setPasscode((prev) => prev + value);
      }
    },
    [passcode.length]
  );

  const handleLogin = useCallback(async () => {
    if (!selectedUser) {
      toast.error(
        createToast(
          "User Selection Required",
          "Please select a user before logging in.",
          "error"
        )
      );
      return;
    }

    if (!selectedUser._id) {
      toast.error(
        createToast(
          "Invalid User Data",
          "User information is incomplete. Please try again.",
          "error"
        )
      );
      return;
    }

    try {
      const result = await dispatch(
        login({
          _id: selectedUser._id.toString(),
          password: passcode,
        })
      ).unwrap();

      if (result) {
        toast.success(
          createToast(
            "Login Successful",
            "You have successfully logged in.",
            "success"
          )
        );
        navigate("/select-pos");
        dispatch(setSelectedUser(users.cashiers[0]));
      }
    } catch (error) {
      setIncorrectPasscode(true);
      // Reset the incorrect passcode state after animation
      setTimeout(() => {
        setIncorrectPasscode(false);
        setPasscode(""); // Optional: clear passcode on error
      }, 1000);
    }
  }, [selectedUser, passcode, dispatch, navigate, users.cashiers]);

  // Memoize the main content sections
  const headerContent = useMemo(
    () => (
      <div>
        <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
          Enter Passcode
        </h2>
        <p className="mt-1 text-sm text-neutral-bright-grey/70">
          Securely authenticate to access the POS system.
        </p>
      </div>
    ),
    []
  );

  return (
    <div className="flex lg:w-1/2 w-full h-full bg-primary-black flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
      <div className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30" />
      <div className="mx-auto w-full max-w-sm lg:w-96">
        {headerContent}
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
        <div className="mt-10 px-4">
          <Button onClick={handleLogin} className="w-full">
            {loading ? <BeatLoader color={loadingColors.primary} size={8} /> : "Log In"}
          </Button>
          <div className="flex justify-between items-center mt-4">
            <TypographySmall className="text-neutral-700 dark:text-neutral-400">
              Having system issues?{" "}
            </TypographySmall>
            <TypographySmall className="text-neutral-700 dark:text-neutral-400">
              Forgot Passcode?
            </TypographySmall>
          </div>
        </div>
      </div>
    </div>
  );
}
