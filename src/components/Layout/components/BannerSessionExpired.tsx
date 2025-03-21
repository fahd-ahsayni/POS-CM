import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { RiErrorWarningFill } from "react-icons/ri";

export default function BannerSessionExpired() {
  const [open, setOpen] = useState(true);
  if (!open) return null; // hide banner when closed
  return (
    <div className="bg-primary-red absolute w-full z-50 shadow-lg">
      <div className="mx-auto max-w-7xl py-2 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <RiErrorWarningFill
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
            <TypographySmall className="ml-3 font-medium text-white">
              Your subscription is nearing expiration. Please contact support to
              maintain uninterrupted access.
            </TypographySmall>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <Button
              type="button"
              variant="link"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Dismiss</span>
              <HiOutlineXMark
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
