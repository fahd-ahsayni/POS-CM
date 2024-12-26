import { logoLightMode } from "@/assets";
import { logoDarkMode } from "@/assets";
import { useTheme } from "@/providers/themeProvider";

export function Loading({
  color = "text-white",
  borderWidth = 3,
  size = 6,
}: {
  color?: string;
  borderWidth?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`animate-spin inline-block size-${size} border-[${borderWidth}px] border-current border-t-transparent ${color} rounded-full`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}

export function LoadingFullScreen() {
  const theme = useTheme();
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10" />
      <img
        src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
        alt="logo"
        className="w-52 h-auto z-10"
      />
    </div>
  );
}
