import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { Delete } from "lucide-react";
import { memo } from "react";

interface NumberPadProps {
  onNumberClick: (value: string) => void;
  numbers?: number[];
  fixLightDark?: boolean;
}

const NumberButton = memo(
  ({
    fixLightDark = false,
    ...props
  }: HTMLMotionProps<"button"> & { fixLightDark?: boolean }) => (
    <motion.button
      whileTap={{ scale: 0.95, borderRadius: "50%" }}
      transition={{ duration: 0.1 }}
      className={cn(
        "font-medium border h-14 w-14 flex items-center justify-center dark:border-white/5 border-primary-black/5 rounded-lg shadow-sm shadow-black/5 hover:dark:bg-neutral-800 hover:bg-white hover:dark:text-white hover:text-primary-black",
        !fixLightDark
          ? "dark:bg-secondary-black bg-secondary-white dark:text-secondary-white"
          : "dark:bg-primary-black bg-neutral-bright-grey dark:text-white text-primary-black hover:dark:bg-primary-black/60 hover:bg-white/60 hover:dark:text-white hover:text-primary-black"
      )}
      {...props}
    />
  )
);

NumberButton.displayName = "NumberButton";

const NumberPad = memo(
  ({
    onNumberClick,
    numbers = Array.from({ length: 9 }, (_, i) => i + 1),
    fixLightDark,
  }: NumberPadProps) => (
    <div className="max-w-[13rem] grid grid-cols-3 grid-rows-4 gap-5">
      {numbers.map((number) => (
        <NumberButton
          fixLightDark={fixLightDark}
          key={number}
          onClick={() => onNumberClick(number.toString())}
        >
          {number}
        </NumberButton>
      ))}
      <NumberButton
        fixLightDark={fixLightDark}
        onClick={() => onNumberClick("C")}
      >
        C
      </NumberButton>
      <NumberButton
        fixLightDark={fixLightDark}
        onClick={() => onNumberClick("0")}
      >
        0
      </NumberButton>
      <NumberButton
        fixLightDark={fixLightDark}
        onClick={() => onNumberClick("delete")}
      >
        <Delete className="w-5 h-5" />
      </NumberButton>
    </div>
  )
);

NumberPad.displayName = "NumberPad";

export default NumberPad;
