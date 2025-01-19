import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from "@/components/ui/sheet";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import * as React from "react";

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  classNames?: string;
  position?: "left" | "right";
}

export default function Drawer({
  children,
  open,
  setOpen,
  title = "",
  classNames = "max-w-md",
  position = "right",
}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetPortal>
        <SheetOverlay className="bg-black/30" />
        <SheetContent
          side={position}
          className={cn(
            "p-0 dark:bg-secondary-black bg-secondary-white w-full !sm:max-w-none",
            classNames
          )}
        >
          <div className="flex h-full flex-col py-4 shadow-xl">
            <div>
              <div className="flex items-start justify-between px-4 sm:px-6">
                <SheetTitle className="font-medium dark:text-white text-primary-black">
                  {toTitleCase(title.toLowerCase())}
                </SheetTitle>
              </div>
            </div>
            <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
              {children}
            </div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
