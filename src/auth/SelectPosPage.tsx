import { logoLightMode } from "@/assets";
import { LoadingFullScreen } from "@/components/global/loading";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store";
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
import { pageAnimations } from "./animation";
import PosCard from "./components/PosCard";
import UserCard from "./components/ui/UserCard";
import OpenShift from "./OpenShift";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { logout } from "@/store/slices/authentication/authSlice";

export default function SelectPosPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isDayOpen = useSelector((state: RootState) => state.dayStatus.isOpen);
  const data = useSelector(selectPosData);
  const loading = useSelector(selectPosLoading);
  const error = useSelector(selectPosError);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  // Get authenticated user from localStorage
  const userAuthenticated: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Handlers
  const handleOpenDay = useCallback(() => {
    setButtonDisabled(true);
    dispatch(openDay());
  }, [dispatch]);

  const handleChoisePos = (id: string) => {
    localStorage.setItem("posId", id);

    const findPos = data.pos?.find((pos) => pos._id === id);
    if (!findPos) return;

    const isAuthorizedUser =
      findPos.shift?.user_id._id === userAuthenticated?.id ||
      userAuthenticated?.position === "Manager";

    if (isAuthorizedUser) {
      toast.success(
        createToast(
          "Welcome back",
          "You are authorized to use this POS",
          "success"
        )
      );
      navigate("/");
    } else {
      toast.error(
        createToast(
          "Unauthorized",
          "You are not authorized to use this POS",
          "error"
        )
      );
    }

    if (findPos.shift === null) {
      setOpen(true);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(checkOpenDay());
    setButtonDisabled(isDayOpen ?? false);
  }, [dispatch, isDayOpen]);

  useEffect(() => {
    dispatch(fetchPosData());
  }, [dispatch]);

  const handleChangeAccount = () => {
    dispatch(logout());
  };

  if (loading) return <LoadingFullScreen />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <OpenShift
        open={open}
        setOpen={setOpen}
        posId={localStorage.getItem("posId") || ""}
      />
      {/* Left Section */}
      <aside className="w-3/12 h-full bg-secondary-white relative">
        <header className="absolute top-0 left-0 z-10 flex h-16 flex-shrink-0">
          <div className="flex flex-1 justify-between px-4 sm:px-6">
            <img src={logoLightMode} alt="logo" className="w-24 h-auto" />
          </div>
        </header>
        <div className="h-full flex items-center justify-center flex-col">
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
          <div className="mt-4">
            <Button onClick={handleChangeAccount}>Change Account</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <motion.main className="w-9/12 h-full bg-secondary-white">
        <motion.div
          {...pageAnimations.mainContent}
          className="bg-primary-black flex flex-col items-start justify-center h-full w-full px-10 sm:px-20 -pt-10"
        >
          <header className="flex justify-between items-start w-full">
            <div>
              <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
                Select your POS station
              </h2>
              <p className="mt-1 text-sm text-neutral-dark-grey">
                Choose your active POS to continue selling.
              </p>
            </div>
            <Button onClick={handleOpenDay} disabled={buttonDisabled}>
              Open new Day
            </Button>
          </header>

          <div className="grid grid-cols-2 gap-4 mt-10 w-11/12">
            {data.pos?.map((pos: PosData) => (
              <PosCard key={pos._id} pos={pos} onClick={handleChoisePos} />
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
