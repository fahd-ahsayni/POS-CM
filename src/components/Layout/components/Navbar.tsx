import { moon, sunrise, sunset } from "@/assets";
import { AlertIcon } from "@/assets/figma-icons";
import { ModeToggleWithDropdown } from "@/components/global/mode-toggle";
import Profile from "@/components/global/Profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextLoop } from "@/components/ui/text-loop";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TypographyP } from "@/components/ui/typography";
import { LucideMaximize } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { handleFullScreen } from "@/lib/utils";

export default function Navbar() {
  const [greeting, setGreeting] = useState("Good Morning");
  const [timeIcon, setTimeIcon] = useState(sunrise);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
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
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <Logo />
          <div className="lg:flex flex-col justify-center flex-1 ml-12 hidden">
            <TypographyP className="flex items-center gap-1 text-xs font-medium py-0.5 overflow-hidden">
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
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-3">
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
