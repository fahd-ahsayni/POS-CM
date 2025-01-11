import React from "react";
import { TypographyH1, TypographyP } from "../ui/typography";
import Noise from "../design/Noise";

export default function Layout({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden relative flex items-center justify-center">
      <div className="absolute w-full h-full z-0">
        <Noise />
      </div>
      <div className="w-96 h-96 dark:bg-primary-red/30 bg-primary-red/20 absolute z-0 blur-3xl rounded-full" />
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-10">
          {icon}
          <div className="flex flex-col items-center justify-center">
            <TypographyH1>{title}</TypographyH1>
            <TypographyP className="mt-3 text-sm text-neutral-700 dark:text-neutral-400 flex flex-col items-center justify-center">
              {description}
            </TypographyP>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
