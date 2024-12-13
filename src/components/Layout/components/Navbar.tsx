import { Fragment, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import { logoDarkMode, logoLightMode, sunset } from "@/assets";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { ModeToggleWithDropdown } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Menu as MenuIcon,
  ChevronDown,
  LucideMaximize,
  Bell,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/themeProvider";
import Profile from "@/components/global/Profile";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function Navbar({
  setMobileMenuOpen,
}: {
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const theme = useTheme();

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="w-full">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <img src={theme.theme === "dark" ? logoDarkMode : logoLightMode} alt="logo" className="w-24 h-auto" />
          <div className="flex flex-col justify-center flex-1 ml-12">
            <TypographyP className="flex items-center gap-1 text-sm font-medium">
              <span>
                <img src={sunset} alt="sunset" className="w-5 h-auto" />
              </span>
              <span>Good Morning! Let's make today productive.</span>
            </TypographyP>
            <TypographySmall className="text-xs text-zinc-100 dark:text-zinc-300 pl-6 mt-1">
              Last updated on July 10, 2024, at 10:00 AM
            </TypographySmall>
          </div>
          <div className="ml-2 flex items-center space-x-2 sm:ml-6 sm:space-x-2">
            <Button size="icon" className="relative">
              <Bell size={16} />
              <span className="absolute h-2 w-2 -top-0.5 ring-1 ring-background left-full -translate-x-1/2 bg-red-500 rounded-full" />
              <span className="sr-only">Notification</span>
            </Button>

            <ModeToggleWithDropdown />

            <Button size="icon" onClick={handleFullScreen}>
              <LucideMaximize size={16} />
              <span className="sr-only">Full screen</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Profile />
          </div>
        </div>
      </div>
    </header>
  );
}
