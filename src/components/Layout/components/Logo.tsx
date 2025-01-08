import { logoWithoutText } from "@/assets";
import { TypographySmall } from "@/components/ui/typography";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img
        // src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
        src={logoWithoutText}
        alt="logo"
        className="w-8 h-auto"
      />
      <span>
        <TypographySmall className="font-semibold leading-[0] text-xs">
          Caisse
        </TypographySmall>
        <TypographySmall className="font-semibold leading-[0] text-xs">
          Manager
        </TypographySmall>
      </span>
    </div>
  );
}
