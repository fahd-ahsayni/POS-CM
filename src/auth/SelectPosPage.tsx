import { closeDay } from "@/api/services";
import { useShift } from "@/auth/context/ShiftContext";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authentication/auth.slice";
import { selectPosError } from "@/store/slices/data/pos.slice";
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAuthorizationWorkflow } from "./hooks/use-authorization-work-flow";
import { useSelectPos } from "./hooks/use-select-pos";

import { logoWithoutText } from "@/assets";
import SessionExpired from "@/components/errors/SessionExpired";
import Authorization from "@/components/global/drawers/auth/Authorization";
import Drawer from "@/components/global/drawers/layout/Drawer";
import ModalConfirmCloseDay from "@/components/global/modal/ModalConfirmCloseDay";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TypographyH2, TypographySmall } from "@/components/ui/typography";
import { RightViewProvider } from "@/components/views/home/right-section/contexts/RightViewContext";
import { PosData } from "@/interfaces/pos";
import { Power } from "lucide-react";
import PosCard from "./components/PosCard";
import UserCard from "./components/ui/UserCard";
import OpenShift from "./OpenShift";

function SelectPosPage() {
  // Custom Hooks
  const {
    data,
    checkDay,
    open,
    reOpen,
    setOpen,
    handleOpenDay,
    handleSelectPos,
  } = useSelectPos();

  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    setIsModalOpen,
    handleAuthorization,
    startAuthFlow,
    admin, // Added to retrieve the confirmed admin
  } = useAuthorizationWorkflow();

  const dispatch = useAppDispatch();
  const error = useSelector(selectPosError);
  const { shiftId } = useShift();

  // State Management
  const [withOpenNewDay, setWithOpenNewDay] = useState(false);
  const [isDayClosing, setIsDayClosing] = useState(false);

  const userAuthenticated = JSON.parse(localStorage.getItem("user") || "null");

  // Event Handlers
  const handleChangeAccount = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClickCloseDay = useCallback(() => {
    startAuthFlow();
  }, [startAuthFlow]);

  const handleCloseDayConfirmed = useCallback(async () => {
    try {
      setIsDayClosing(true);

      const response = await closeDay({
        openNewDay: withOpenNewDay,
        confirmed_by: admin?.user.id || "",
      });

      if (response.status === 200) {
        toast.success(
          createToast("Closed success", "The Day is close", "success")
        );
      }
    } catch (error: any) {
      toast.error(createToast("Close faild", "Close Day is close", "error"));
    } finally {
      setIsModalOpen(false);
      window.location.reload();
    }
  }, [withOpenNewDay, setIsModalOpen, admin]);

  if (error) return <SessionExpired />;

  return (
    <div className="flex h-screen overflow-hidden relative">
      <RightViewProvider>
        <OpenShift
          open={open}
          setOpen={setOpen}
          posId={localStorage.getItem("posId") || ""}
          reOpen={reOpen}
          shiftId={shiftId ?? ""}
        />
      </RightViewProvider>

      <Drawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        title="Authorization Required"
        description="Please enter your admin credentials to close the day"
        position="right"
      >
        <Authorization
          setAuthorization={(authorized) => handleAuthorization(authorized)}
          setAdmin={(adminData) => handleAuthorization(true, adminData)}
        />
      </Drawer>

      <ModalConfirmCloseDay
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onConfirm={handleCloseDayConfirmed}
      >
        <div className="flex items-center gap-2 justify-center">
          <Switch
            color="red"
            onChange={() => setWithOpenNewDay((prev) => !prev)}
          />
          <TypographySmall>Open new day</TypographySmall>
        </div>
      </ModalConfirmCloseDay>

      <aside className="lg:w-3/12 w-4/12 h-full bg-secondary-white relative">
        <header className="absolute top-0 left-0 z-10 flex h-16 flex-shrink-0">
          <div className="flex flex-1 justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <img src={logoWithoutText} alt="logo" className="w-8 h-auto" />
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
          {userAuthenticated && (
            <>
              <UserCard
                withRole={true}
                user={userAuthenticated}
                isActive={true}
                className="scale-105"
              />
              <div className="pt-16">
                <Button onClick={handleChangeAccount}>Change Account</Button>
              </div>
            </>
          )}
        </div>
      </aside>

      <main className="lg:w-9/12 w-8/12 h-full bg-secondary-white">
        <div className="bg-primary-black flex flex-col items-start justify-center h-full w-full px-10 lg:px-20 -pt-10">
          <header className="flex justify-between items-start w-full">
            <div>
              <TypographyH2 className="text-white">
                Select your POS station
              </TypographyH2>
              <TypographySmall className="mt-1 text-[0.8rem] text-neutral-dark-grey">
                Choose your active POS to continue selling.
              </TypographySmall>
            </div>
            <div className="flex gap-x-2">
              <Button
                onClick={handleClickCloseDay}
                disabled={!checkDay || isDayClosing}
                className="gap-x-2"
              >
                <Power className="w-4 h-4" />
                <span>Close Day</span>
              </Button>
              <Button onClick={handleOpenDay} disabled={checkDay}>
                Open new Day
              </Button>
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-10 mt-10 w-11/12">
            {data.pos?.map((pos: PosData) => (
              <PosCard key={pos._id} pos={pos} onClick={handleSelectPos} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(SelectPosPage);
