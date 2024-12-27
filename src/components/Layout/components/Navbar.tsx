import { logoDarkMode, logoLightMode, sunset } from "@/assets";
import { AlertIcon } from "@/assets/figma-icons";
import { ModeToggleWithDropdown } from "@/components/global/mode-toggle";
import Profile from "@/components/global/Profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useTheme } from "@/providers/themeProvider";
import { LucideMaximize } from "lucide-react";

export default function Navbar() {
  const theme = useTheme();


  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleResetApp = () => {
    window.location.reload();
  };

  return (
    <header className="w-full">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <img
            onClick={handleResetApp}
            src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
            alt="logo"
            className="w-24 h-auto"
          />
          <div className="lg:flex flex-col justify-center flex-1 ml-12 hidden">
            <TypographyP className="flex items-center gap-1 text-xs font-medium">
              <span>
                <img src={sunset} alt="sunset" className="w-5 h-auto" />
              </span>
              <span>Good MorninG! Let's make today productive.</span>
            </TypographyP>
            <TypographySmall className="text-[0.7rem] leading-3 text-zinc-100 dark:text-zinc-300 pl-6 mt-1">
              Last updated on July 10, 2024, at 10:00 AM
            </TypographySmall>
          </div>
          <div className="ml-2 flex items-center space-x-2 sm:ml-6 sm:space-x-2">
            <Button size="icon" className="relative">
              <AlertIcon className="w-[1.2rem] h-auto fill-white" />
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
