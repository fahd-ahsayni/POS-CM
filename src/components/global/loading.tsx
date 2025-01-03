import { logoLightMode } from "@/assets";
import { logoDarkMode } from "@/assets";
import { useTheme } from "@/providers/themeProvider";

export function LoadingFullScreen() {
  const theme = useTheme();
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10 animate-pulse" />
      <img
        src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
        alt="logo"
        className="w-52 h-auto z-10"
      />
    </div>
  );
}
