import * as React from "react";
import {
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  Drawer as DrawerPrimitive,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/functions/string-transforms";
import { motion } from "framer-motion";

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  classNames?: string;
  position?: "left" | "right";
}

const drawerContentVariants = cva(
  "fixed z-50 flex h-auto flex-col bg-background w-full",
  {
    variants: {
      direction: {
        right: "ml-24 right-0 inset-y-0",
        left: "mr-24 left-0 inset-y-0",
      },
    },
    defaultVariants: {
      direction: "right",
    },
  }
);

export default function Drawer({
  children,
  open,
  setOpen,
  title = "",
  classNames = "max-w-md",
  position = "right",
}: DrawerProps) {
  return (
    <DrawerPrimitive open={open} onOpenChange={setOpen} direction={position}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 z-50 bg-black/30" />
        <DrawerContent
          className={cn(
            drawerContentVariants({ direction: position }),
            "dark:bg-secondary-black bg-secondary-white",
            classNames
          )}
        >
          <motion.div layout className="flex h-full flex-col py-4 shadow-xl">
            <motion.div layout>
              <div className="flex items-start justify-between px-4 sm:px-6">
                <DrawerTitle className="font-medium dark:text-white text-primary-black">
                  {toTitleCase(title.toLowerCase())}
                </DrawerTitle>
                <div className="ml-3 flex h-7 items-center">
                  <Button
                    variant="link"
                    size="icon"
                    className="text-primary-black dark:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div
              layout
              className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto"
            >
              {children}
            </motion.div>
          </motion.div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerPrimitive>
  );
}
