import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from "@/components/ui/sheet";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useVirtualKeyboard } from "../keyboard/VirtualKeyboardGlobalContext";

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  classNames?: string;
  position?: "left" | "right";
  description?: string;
}

export default function Drawer({
  children,
  open,
  setOpen,
  title = "",
  classNames = "max-w-md",
  position = "right",
  description = "",
}: DrawerProps) {
  // Get the state of the global virtual keyboard
  const { showKeyboard } = useVirtualKeyboard();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetPortal>
        <SheetOverlay className="bg-black/30" />
        <SheetContent
          side={position}
          // Use onPointerDownOutside to intercept outside clicks
          onPointerDownOutside={(event) => {
            if (showKeyboard) {
              event.preventDefault();
            }
          }}
          className={cn(
            "p-0 dark:bg-secondary-black bg-secondary-white w-full h-full !sm:max-w-none",
            classNames
          )}
        >
          <div className="flex h-full flex-col pb-4">
            <SheetHeader className="max-w-md pt-4 px-4">
              <SheetTitle className="-mb-1">
                {toTitleCase(title.toLowerCase())}
              </SheetTitle>
              <SheetDescription className="text-[0.8rem] pr-8">
                {description}
              </SheetDescription>
            </SheetHeader>
            <div className="relative mt-6 flex-1 px-3 overflow-y-auto">
              {children}
            </div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
