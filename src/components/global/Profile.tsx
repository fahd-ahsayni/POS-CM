import { logoutService } from "@/api/services";
import { unknownUser } from "@/assets";
import { DisplayIcon } from "@/assets/figma-icons";
import CloseShift from "@/auth/CloseShift";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateName } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { logout } from "@/store/slices/authentication/auth.slice";
import { selectPosData } from "@/store/slices/data/pos.slice";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, LogOut, Power } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TypographySmall } from "../ui/typography";
import {
  isCustomerDisplayOpen,
  openCustomerDisplay,
} from "./Customer-display/useCustomerDisplay";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useDispatch<AppDispatch>();
  const posId = localStorage.getItem("posId");
  const pos = useSelector(selectPosData);
  const currentShift = pos.pos.find((p: any) => p._id === posId)?.shift;

  console.log(user);

  localStorage.setItem("shiftId", currentShift?._id || "");

  const handleLogout = () => {
    dispatch(logout());
    logoutService();
  };

  const handleCustomerDisplay = () => {
    if (!isCustomerDisplayOpen()) {
      openCustomerDisplay();
    }
  };

  const menuItems = [
    {
      icon: DisplayIcon,
      label: "Customer Display",
      onClick: handleCustomerDisplay,
    },
    { icon: Power, label: "End Shift" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <>
      <CloseShift open={open} setOpen={setOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-auto p-0 flex">
            <div>
              <img
                className="inline-block size-10 rounded-md border border-border"
                src={user?.image ? user?.image : unknownUser}
                alt=""
              />
            </div>
            <div className="ml-3 md:flex hidden flex-col justify-center items-start h-10">
              <TypographySmall className="font-medium capitalize">
                {truncateName(user?.name, 20)}
              </TypographySmall>
              <TypographySmall className="text-xs text-neutral-dark-grey">
                {user?.position}
              </TypographySmall>
            </div>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              className="ms-2 opacity-60 mt-0.5"
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-52 mt-2 -ml-10">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="truncate text-xs font-medium text-foreground">
              {pos.pos.find((p: any) => p._id === posId)?.name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {currentShift?.opening_time &&
                formatDistanceToNow(new Date(currentShift.opening_time), {
                  addSuffix: true,
                })}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {menuItems.slice(0, 1).map((item, index) => (
              <DropdownMenuItem key={index} onClick={item.onClick}>
                <item.icon
                  size={17}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Power
                size={17}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>End Shift</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="!text-primary-red"
            onClick={handleLogout}
          >
            <LogOut
              size={17}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
