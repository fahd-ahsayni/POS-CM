import { logoutService } from "@/api/services";
import { DisplayIcon } from "@/assets/figma-icons";
import CloseShift from "@/auth/CloseShift";
import { truncateName } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { logout } from "@/store/slices/authentication/auth.slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Avatar } from "@heroui/avatar";
import { ChevronDown, LogOut, Power } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { TypographySmall } from "../ui/typography";
import {
  isCustomerDisplayOpen,
  openCustomerDisplay,
} from "./Customer-display/useCustomerDisplay";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useDispatch<AppDispatch>();

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
      <Menu>
        <MenuButton className="h-auto p-0 flex">
          <div>
            <Avatar
              radius="lg"
              showFallback={true}
              fallback={
                <span className="font-medium text-sm">
                  {user?.name?.charAt(0)}
                </span>
              }
              src={user?.image}
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
        </MenuButton>

        <MenuItems
          anchor="bottom"
          className="z-[9999] w-52 bg-white dark:bg-primary-black absolute rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none p-3 mt-2 shadow-lg border border-border"
        >
          <MenuItem>
            {({ active }) => (
              <span
                onClick={handleCustomerDisplay}
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm rounded`}
              >
                <DisplayIcon className="opacity-60 mr-2" aria-hidden="true" />
                Customer Display
              </span>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <span
                onClick={() => setOpen(true)}
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm rounded`}
              >
                <Power
                  size={17}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                End Shift
              </span>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <span
                onClick={handleLogout}
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm text-primary-red rounded`}
              >
                <LogOut
                  size={17}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                Logout
              </span>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
}
