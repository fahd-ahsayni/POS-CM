import { logoLightMode } from "@/assets";
import { logoDarkMode } from "@/assets";
import { useTheme } from "@/providers/themeProvider";
import Ripple from "../ui/ripple";

export function LoadingFullScreen() {
  const theme = useTheme();
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10 animate-pulse" />
      <img
        src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
        alt="logo"
        className="w-32 h-auto z-10"
      />
      <Ripple />
    </div>
  );
}
