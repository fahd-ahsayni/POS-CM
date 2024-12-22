import { HTMLMotionProps, motion } from "framer-motion";
import { Delete } from "lucide-react";
import { memo } from "react";

interface NumberPadProps {
  onNumberClick: (value: string) => void;
  numbers?: number[];
}

const NumberButton = memo(({ ...props }: HTMLMotionProps<"button">) => (
  <motion.button
    whileTap={{ scale: 0.95, borderRadius: "50%" }}
    transition={{ duration: 0.1 }}
    className="dark:bg-secondary-black bg-secondary-white font-medium dark:text-secondary-white border h-14 w-14 flex items-center justify-center dark:border-white/5 border-primary-black/5 rounded-lg shadow-sm shadow-black/5 hover:dark:bg-neutral-800 hover:bg-white hover:dark:text-white hover:text-primary-black"
    {...props}
  />
));

NumberButton.displayName = "NumberButton";

const NumberPad = memo(({ 
  onNumberClick, 
  numbers = Array.from({ length: 9 }, (_, i) => i + 1)
}: NumberPadProps) => (
  <div className="max-w-[13rem] grid grid-cols-3 grid-rows-4 gap-3.5">
    {numbers.map((number) => (
      <NumberButton
        key={number}
        onClick={() => onNumberClick(number.toString())}
      >
        {number}
      </NumberButton>
    ))}
    <NumberButton onClick={() => onNumberClick("C")}>C</NumberButton>
    <NumberButton onClick={() => onNumberClick("0")}>0</NumberButton>
    <NumberButton onClick={() => onNumberClick("delete")}>
      <Delete className="w-5 h-5" />
    </NumberButton>
  </div>
));

NumberPad.displayName = "NumberPad";

export default NumberPad;
