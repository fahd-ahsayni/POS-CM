import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input dark:bg-white/5 bg-primary-black/5 px-3 py-2 text-[.8rem] text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 dark:focus-visible:border-white/80 focus-visible:border-primary-black/40 focus-visible:outline-none focus-visible:ring-[3px] dark:focus-visible:ring-ring/20 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
