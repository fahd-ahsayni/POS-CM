import { logoutService } from "@/api/services";
import { unknownUser } from "@/assets";
import { DisplayIcon } from "@/assets/figma-icons";
import CloseShift from "@/auth/CloseShift";
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import { truncateName } from "@/lib/utils";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authentication/auth.slice";
import { fetchPosData } from "@/store/slices/data/pos.slice";
import { PosData } from "@/types/pos.types";
import * as Headless from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, LogOut, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../ui/avatar";
import { TypographySmall } from "../ui/typography";
import {
  isCustomerDisplayOpen,
  openCustomerDisplay,
} from "./Customer-display/useCustomerDisplay";

interface UserData {
  id: string;
  name: string;
  image?: string;
  position: string;
}

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState<PosData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const pos = useSelector((state: RootState) => state.pos.data.pos);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}") as UserData;
    setUser(user);
    dispatch(fetchPosData());
  }, [dispatch]);

  useEffect(() => {
    if (pos && user?.id) {
      const currentPos = pos.find(
        (p: PosData) => p.shift?.user_id?._id === user.id
      );
      setCurrentPos(currentPos || null);
    }
  }, [pos, user]);

  const handleLogout = () => {
    dispatch(logout());
    logoutService();
  };

  const handleCustomerDisplay = () => {
    if (!isCustomerDisplayOpen()) {
      openCustomerDisplay();
    }
  };

  return (
    <>
      <CloseShift open={open} setOpen={setOpen} />
      <Dropdown>
        <Headless.MenuButton
          className="flex items-center gap-3 rounded-xl border border-transparent"
          aria-label="Account options"
        >
          <Avatar className="rounded-lg">
            <AvatarImage
              src={
                user?.image
                  ? `${import.meta.env.VITE_BASE_URL}${user?.image}`
                  : unknownUser
              }
            />
          </Avatar>
          <div className="md:flex hidden flex-col justify-center items-start">
            <TypographySmall className="font-medium capitalize">
              {truncateName(user?.name ?? "", 20)}
            </TypographySmall>
            <TypographySmall className="text-xs text-neutral-dark-grey">
              {user?.position}
            </TypographySmall>
          </div>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            className="ml-auto mr-1 size-4 shrink-0 stroke-zinc-400"
            aria-hidden="true"
          />
        </Headless.MenuButton>

        <DropdownMenu className="min-w-[--button-width] z-[9999] p-2 -ml-10">
          <DropdownHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-zinc-800 dark:text-white flex-1">
                {currentPos?.name || ""}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex-1 text-end">
                {currentPos?.shift?.opening_time
                  ? formatDistanceToNow(
                      new Date(currentPos.shift.opening_time),
                      { addSuffix: true }
                    )
                  : ""}
              </div>
            </div>
          </DropdownHeader>

          <DropdownItem onClick={handleCustomerDisplay}>
            <DisplayIcon className="opacity-60" aria-hidden="true" />
            <DropdownLabel className="pl-2">Customer Display</DropdownLabel>
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem onClick={() => setOpen(true)}>
            <Power size={17} className="opacity-60" aria-hidden="true" />
            <DropdownLabel className="pl-2">End Shift</DropdownLabel>
          </DropdownItem>

          <DropdownItem onClick={handleLogout}>
            <LogOut
              size={17}
              className="opacity-60 text-primary-red"
              aria-hidden="true"
            />
            <DropdownLabel className="pl-2 text-primary-red">
              Logout
            </DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
