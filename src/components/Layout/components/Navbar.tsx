import { moon, sunrise, sunset } from "@/assets";
import { AlertIcon } from "@/assets/figma-icons";
import { ModeToggleWithDropdown } from "@/components/global/mode-toggle";
import Profile from "@/components/global/Profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextLoop } from "@/components/ui/text-loop";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TypographyP } from "@/components/ui/typography";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn, handleFullScreen } from "@/lib/utils";
import { LucideMaximize } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [greeting, setGreeting] = useState("Good Morning");
  const [timeIcon, setTimeIcon] = useState(sunrise);
  const [currentTime, setCurrentTime] = useState(new Date());
  const onlineStatus = useOnlineStatus();

  useEffect(() => {
    const updateGreetingAndIcon = () => {
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
    };

    updateGreetingAndIcon();
    const interval = setInterval(updateGreetingAndIcon, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  const motivatedMessages = [
    "Let's make today productive!",
    "Stay focused and keep going!",
    "You can do it!",
    "Keep pushing forward!",
    "Believe in yourself!",
  ];

  return (
    <header className="w-full">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between mr-4">
          <div className="lg:w-8/12 md:w-3/5 w-4/12 bg-zinc-900 flex items-center px-4 sm:px-6">
            <div className="h-full absolute w-40 -left-20 bg-zinc-900" />
            <Logo />
            <div className="lg:flex flex-col justify-center flex-1 ml-12 hidden">
              <TypographyP className="flex items-center gap-1 text-xs font-medium py-0.5 overflow-hidden text-white">
                <span>
                  <img src={timeIcon} alt="time-icon" className="w-4 h-auto" />
                </span>
                <span>
                  {greeting}!{" "}
                  <TextLoop transition={{ duration: 0.25 }} interval={3}>
                    {motivatedMessages.map((message) => (
                      <span key={message}>{message}</span>
                    ))}
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
            <Badge className="h-8 rounded-lg space-x-1">
              <span
                className={cn(
                  "size-2 rounded-full",
                  onlineStatus ? "bg-green-600" : "bg-error-color"
                )}
              />
              <span>{onlineStatus ? "Online" : "Offline"}</span>
            </Badge>
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
}
