import { useTheme } from "@/providers/themeProvider";
import { Toggle } from "../ui/toggle";
import { MoonIcon, SunIcon } from "@/assets/figma-icons";

export function ModeToggleWithDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Toggle
        className="group size-8 !bg-primary-red !rounded-md"
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <SunIcon
          className="w-[1.2rem] h-auto shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 !fill-white"
          aria-hidden="true"
        />
        <MoonIcon
          className="w-[1.2rem] absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 !fill-white"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
