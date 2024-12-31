import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Link, To } from "react-router-dom";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:bg-[#AAAAAA] disabled:text-[#7E7E7E] disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-red text-white shadow-sm shadow-black/5 hover:bg-[#CE0303]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "dark:bg-white/5 dark:text-[#AAAAAA] shadow-sm shadow-black/5 dark:hover:bg-white dark:hover:text-[#121212] bg-[#121212]/5 hover:bg-[#121212] hover:text-[#FFFFFF]",
        ghost:
          "!text-white",
        link: "text-primary-black dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  to?: To;
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { className, variant, size, asChild = false, to, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : to ? Link : "button";
    const componentProps = to ? { to, ...props } : { ...props, disabled };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...componentProps}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
