import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] rounded-md border border-input dark:bg-white/5 bg-primary-black/5 px-3 py-1.5 text-[.8rem] text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 dark:focus-visible:border-white/80 focus-visible:border-primary-black/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
