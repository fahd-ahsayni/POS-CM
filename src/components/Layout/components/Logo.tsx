import { logoWithoutText } from "@/assets";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "sm" }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      image: "w-8",
      text: "text-xs",
    },
    md: {
      container: "gap-2",
      image: "w-10",
      text: "text-sm",
    },
    lg: {
      container: "gap-3",
      image: "w-12",
      text: "text-base",
    },
  };

  return (
    <div
      className={cn("flex items-center relative", sizeClasses[size].container)}
    >
      <img
        src={logoWithoutText}
        alt="logo"
        className={cn("h-auto", sizeClasses[size].image)}
      />
      <span>
        <TypographySmall
          className={cn(
            "font-semibold leading-[0]",
            sizeClasses[size].text,
            location.pathname === "/"
              ? "text-white"
              : "text-primary-black dark:text-white"
          )}
        >
          Caisse
        </TypographySmall>
        <TypographySmall
          className={cn(
            "font-semibold -mt-0.5 text-white",
            sizeClasses[size].text,
            location.pathname === "/"
              ? "text-white"
              : "text-primary-black dark:text-white"
          )}
        >
          Manager
        </TypographySmall>
      </span>
    </div>
  );
}
