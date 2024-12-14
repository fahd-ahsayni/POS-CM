import { useTheme } from "@/providers/themeProvider";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "../ui/toggle";

export function ModeToggleWithDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Toggle
        className="group size-9 !bg-red-600"
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <Moon
          size={16}
          strokeWidth={2}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 !text-white"
          aria-hidden="true"
        />
        <Sun
          size={16}
          strokeWidth={2}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 !text-white"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
