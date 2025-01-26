import { logoWithoutText } from "@/assets";
import { useShift } from "@/auth/context/ShiftContext";
import SessionExpired from "@/components/errors/SessionExpired";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographySmall } from "@/components/ui/typography";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authentication/auth.slice";
import { selectPosError } from "@/store/slices/data/pos.slice";
import { PosData } from "@/types/pos.types";
import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import PosCard from "./components/PosCard";
import UserCard from "./components/ui/UserCard";
import { useSelectPos } from "./hooks/useSelectPos";
import OpenShift from "./OpenShift";

function SelectPosPage() {
  const {
    data,
    checkDay,
    open,
    reOpen,
    setOpen,
    handleOpenDay,
    handleSelectPos,
  } = useSelectPos();
  const dispatch = useAppDispatch();
  const error = useSelector(selectPosError);
  const { shiftId } = useShift();

  const userAuthenticated = useMemo(() => 
    JSON.parse(localStorage.getItem("user") || "null"),
    []
  );

  const handleChangeAccount = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  if (error) return <SessionExpired />;

  return (
    <div className="flex h-screen overflow-hidden relative">
      <OpenShift
        open={open}
        setOpen={setOpen}
        posId={localStorage.getItem("posId") || ""}
        reOpen={reOpen}
        shiftId={shiftId ?? ""}
      />
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
            <Button onClick={handleOpenDay} disabled={checkDay}>
              Open new Day
            </Button>
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
