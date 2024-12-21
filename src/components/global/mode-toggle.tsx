import { useTheme } from "@/providers/themeProvider";
import { Toggle } from "../ui/toggle";
import { MoonIcon, SunIcon } from "@/assets/figma-icons";

export function ModeToggleWithDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Toggle
        className="group size-9 !bg-red-600 !rounded-md"
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <MoonIcon
          className="w-5 h-auto shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 !fill-white"
          aria-hidden="true"
        />
        <SunIcon
          className="w-5 absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 !fill-white"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
