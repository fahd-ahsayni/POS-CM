import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DrawerProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  classNames?: string;
  position?: 'left' | 'right';
}

export default function Drawer({
  children,
  open,
  setOpen,
  title,
  classNames = "max-w-md",
  position = 'right',
}: DrawerProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-10" 
        onClose={(value) => {
          // Prevent closing when clicking inside the keyboard
          const target = event?.target as HTMLElement;
          if (target?.closest('[data-keyboard="true"]')) {
            return;
          }
          setOpen(value);
        }}
      >
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden transform-gpu bg-primary-black/70">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 ${position}-0 flex max-w-full ${position === 'left' ? 'pr-10' : 'pl-10'}`}>
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enterFrom={position === 'left' ? '-translate-x-full' : 'translate-x-full'}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo={position === 'left' ? '-translate-x-full' : 'translate-x-full'}
              >
                <DialogPanel
                  className={cn("pointer-events-auto w-screen", classNames)}
                >
                  <div className="flex h-full flex-col overflow-y-scroll dark:bg-secondary-black bg-secondary-white py-6 shadow-xl">
                    <div className="">
                      <div className="flex items-start justify-between px-4 sm:px-6">
                        <DialogTitle className="text-lg font-medium">
                          {title}
                        </DialogTitle>
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
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 bg-blue overflow-y-auto">
                      {children}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
