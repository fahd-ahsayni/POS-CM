import { logoWithoutText } from "@/assets";
import { useShift } from "@/auth/context/ShiftContext";
import { LoadingFullScreen } from "@/components/global/loading";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographySmall } from "@/components/ui/typography";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authentication/authSlice";
import {
  checkOpenDay,
  openDay,
} from "@/store/slices/authentication/openDaySlice";
import {
  fetchPosData,
  selectPosData,
  selectPosError,
  selectPosLoading,
} from "@/store/slices/data/posSlice";
import { User } from "@/types";
import { PosData } from "@/types/pos";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { pageAnimations } from "./animation";
import PosCard from "./components/PosCard";
import UserCard from "./components/ui/UserCard";
import OpenShift from "./OpenShift";

const DAY_NOT_OPEN_WARNING = "Day is not open";
const UNAUTHORIZED_ERROR = "Unauthorized";
const WELCOME_BACK_SUCCESS = "Welcome back";

export default function SelectPosPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen: isDayOpen } = useSelector(
    (state: RootState) => state.dayStatus
  );
  const data = useSelector(selectPosData);
  const loading = useSelector(selectPosLoading);
  const error = useSelector(selectPosError);
  const [checkDay, setCheckDay] = useState(false);
  const [open, setOpen] = useState(false);
  const [reOpen, setReOpen] = useState(false);
  const { shiftId, setShiftId } = useShift();

  console.log(data.pos);

  // Get authenticated user from localStorage
  const userAuthenticated: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Handlers
  const handleOpenDay = useCallback(() => {
    setCheckDay(true);
    dispatch(openDay());
  }, [dispatch]);

  const handleSelectPos = useCallback(
    (id: string) => {
      // Check if day is not open first
      if (!checkDay || !isDayOpen) {
        toast.warning(
          createToast(
            DAY_NOT_OPEN_WARNING,
            "Please open the day first",
            "warning"
          )
        );
        return;
      }

      const findPos = data.pos?.find((pos) => pos._id === id);
      if (!findPos) return;

      localStorage.setItem("posId", id);

      const isAuthorizedUser =
        findPos.shift?.user_id._id === userAuthenticated?.id ||
        userAuthenticated?.position === "Manager";

      if (isAuthorizedUser) {
        setShiftId(findPos.shift?._id ?? "");
        localStorage.setItem("shiftID", findPos.shift?._id ?? "");
        toast.success(
          createToast(
            WELCOME_BACK_SUCCESS,
            "You are authorized to use this POS",
            "success"
          )
        );
        if (findPos.shift?.status !== "opening_control") {
          navigate("/");
        } else {
          setOpen(true);
          setReOpen(true);
        }
        return;
      }

      if (findPos.shift !== null && !isAuthorizedUser) {
        toast.error(
          createToast(
            UNAUTHORIZED_ERROR,
            "You are not authorized to use this POS",
            "error"
          )
        );
        return;
      }

      if (findPos.shift?.status === "opening_control") {
        toast.info(
          createToast(
            `Welcome back ${userAuthenticated?.name}`,
            "Please open the shift first",
            "info"
          )
        );
        setOpen(true);
        setReOpen(true);
        return;
      }

      if (findPos.shift === null) {
        setOpen(true);
        setReOpen(false);
        return;
      }
    },
    [data.pos, userAuthenticated, checkDay, isDayOpen, navigate, setShiftId]
  );

  // Effects
  useEffect(() => {
    dispatch(checkOpenDay());
    setCheckDay(isDayOpen ?? false);
  }, [dispatch, isDayOpen]);

  useEffect(() => {
    dispatch(fetchPosData());
  }, [dispatch]);

  const handleChangeAccount = () => {
    dispatch(logout());
  };

  useEffect(() => {
    localStorage.removeItem("posId");
    localStorage.removeItem("shiftID");

    console.log(data.pos);
  }, []);

  if (loading) return <LoadingFullScreen />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <OpenShift
        open={open}
        setOpen={setOpen}
        posId={localStorage.getItem("posId") || ""}
        reOpen={reOpen}
        shiftId={shiftId ?? ""}
      />
      {/* Left Section */}
      <aside className="lg:w-3/12 w-4/12 h-full bg-secondary-white relative">
        <header className="absolute top-0 left-0 z-10 flex h-16 flex-shrink-0">
          <div className="flex flex-1 justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <img
                // src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
                src={logoWithoutText}
                alt="logo"
                className="w-8 h-auto"
              />
              <span>
                <TypographySmall className="font-semibold leading-[0] text-xs text-primary-black">
                  Caisse
                </TypographySmall>
                <TypographySmall className="font-semibold leading-[0] text-xs text-primary-black">
                  Manager
                </TypographySmall>
              </span>
            </div>
          </div>
        </header>
        <div className="h-full flex flex-col items-center justify-center">
          <motion.div {...pageAnimations.userCard}>
            {userAuthenticated && (
              <UserCard
                withRole={true}
                user={userAuthenticated}
                isActive={true}
                className="scale-105"
              />
            )}
          </motion.div>
          <div className="pt-16">
            <Button onClick={handleChangeAccount}>Change Account</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <motion.main className="lg:w-9/12 w-8/12 h-full bg-secondary-white">
        <motion.div
          {...pageAnimations.mainContent}
          className="bg-primary-black flex flex-col items-start justify-center h-full w-full px-10 lg:px-20 -pt-10"
        >
          <header className="flex justify-between items-start w-full">
            <div>
              <TypographyH2 className="text-white">
                Select your POS station
              </TypographyH2>
              <TypographySmall className="mt-1 text-[0.8rem] text-neutral-dark-grey">
                Choose your active POS to continue selling.
              </TypographySmall>
            </div>
            <Button onClick={handleOpenDay} disabled={checkDay}>
              Open new Day
            </Button>
          </header>

          <div className="grid lg:grid-cols-2 gap-10 mt-10 w-11/12">
            {data.pos?.map((pos: PosData) => (
              <PosCard key={pos._id} pos={pos} onClick={handleSelectPos} />
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
