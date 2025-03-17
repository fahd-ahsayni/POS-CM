import { moon, sunrise, sunset } from "@/assets";
import { AlertIcon } from "@/assets/figma-icons";
import { ModeToggleWithDropdown } from "@/components/global/mode-toggle";
import Profile from "@/components/global/Profile";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextLoop } from "@/components/ui/text-loop";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TypographyP } from "@/components/ui/typography";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn, handleFullScreen } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";
import { LucideMaximize, Wifi, WifiOff } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";

export default memo(function Navbar() {
  const [greeting, setGreeting] = useState("Good Morning");
  const [timeIcon, setTimeIcon] = useState(sunrise);
  const [currentTime, setCurrentTime] = useState(new Date());
  const onlineStatus = useOnlineStatus();

  const { theme } = useTheme();
  const location = useLocation();

  const updateGreetingAndIcon = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setGreeting("Good Morning");
      setTimeIcon(sunrise);
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
      setTimeIcon(sunset);
    } else {
      setGreeting("Good Evening");
      setTimeIcon(moon);
    }
  }, [setGreeting, setTimeIcon]);

  useEffect(() => {
    updateGreetingAndIcon();
    const interval = setInterval(updateGreetingAndIcon, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateGreetingAndIcon]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const motivatedMessages = useMemo(() => [
    "Let's make today productive!",
    "Stay focused and keep going!",
    "You can do it!",
    "Keep pushing forward!",
    "Believe in yourself!",
  ], []);

  const renderedMotivatedMessages = useMemo(() => (
    motivatedMessages.map((message) => (
      <span key={message}>{message}</span>
    ))
  ), [motivatedMessages]);

  const transitionProps = useMemo(() => ({ duration: 0.25 }), []);

  const handleFullScreenClick = useCallback(() => {
    handleFullScreen();
  }, []);

  return (
    <header className="w-full">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between mr-4">
          <div
            className={cn(
              `lg:w-8/12 md:w-3/5 w-4/12  flex items-center px-4 sm:px-6`,
              location.pathname === "/" ? "bg-zinc-900" : "bg-background"
            )}
          >
            <div
              className={cn(
                "h-full absolute w-40 -left-20",
                location.pathname === "/" ? "bg-zinc-900" : "bg-background"
              )}
            />
            <Logo />
            <div className="lg:flex flex-col justify-center flex-1 ml-12 hidden">
              <TypographyP
                className={cn(
                  "flex items-center gap-1 text-xs font-medium py-0.5 overflow-hidden",
                  location.pathname === "/"
                    ? "text-white"
                    : "text-primary-black dark:text-white"
                )}
              >
                <span>
                  <img src={timeIcon} alt="time-icon" className="w-4 h-auto" />
                </span>
                <span>
                  {greeting}!{" "}
                  <TextLoop transition={transitionProps} interval={3}>
                    {renderedMotivatedMessages}
                  </TextLoop>
                </span>
              </TypographyP>
              <TextShimmer
                duration={2}
                className="text-[0.7rem] leading-3 mt-0.5"
              >
                {`Last updated on ${currentTime.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}, at ${currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`}
              </TextShimmer>
            </div>
          </div>
          <div className="lg:w-4/12 md:w-2/5 w-8/12 flex items-center justify-end space-x-4 sm:space-x-3">
            <span className="size-8 dark:bg-secondary-black bg-white relative flex items-center justify-center rounded-lg border border-border">
              {onlineStatus ? (
                <Wifi
                  size={16}
                  strokeWidth={2}
                  className="w-4 h-4 text-green-500"
                />
              ) : (
                <WifiOff
                  size={16}
                  strokeWidth={2}
                  className="size-4 text-error-color"
                />
              )}
              <BorderBeam
                colorFrom={onlineStatus ? "#00FB00" : "#FB0000"}
                colorTo={theme === "dark" ? (onlineStatus ? "#005200" : "#520000") : (onlineStatus ? "#00FB00" : "#FB0000")}
                size={20}
                borderWidth={1.5}
                duration={5}
              />
            </span>
            <Separator
              orientation="vertical"
              className="h-6 !bg-neutral-dark-grey/50"
            />
            <Button size="icon" className="relative">
              <AlertIcon className="w-[1.2rem] h-auto fill-white" />
              <span className="absolute h-2 w-2 -top-0.5 ring-1 ring-background left-full -translate-x-1/2 bg-red-500 rounded-full" />
              <span className="sr-only">Notification</span>
            </Button>

            <ModeToggleWithDropdown />

            <Button size="icon" onClick={handleFullScreenClick}>
              <LucideMaximize size={16} />
              <span className="sr-only">Full screen</span>
            </Button>

            <Separator
              orientation="vertical"
              className="h-6 !bg-neutral-dark-grey/50"
            />
            <Profile />
          </div>
        </div>
      </div>
    </header>
  );
});
