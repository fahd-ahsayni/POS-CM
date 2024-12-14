import { Delete } from "lucide-react";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface NumberPadProps {
  onNumberClick: (value: string) => void;
  numbers?: number[];
}

function NumberButton({ ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, borderRadius: "50%" }}
      transition={{ duration: 0.1 }}
      className="dark:bg-zinc-800/50 bg-white text-lg dark:text-gray-50 border h-14 w-14 flex items-center justify-center dark:border-zinc-800 border-zinc-50/50 rounded-lg shadow-sm shadow-black/5 hover:dark:bg-zinc-800 hover:bg-red-600 hover:dark:text-white hover:text-white"
      {...props}
    >
      {props.children}
    </motion.button>
  );
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  numbers = Array.from({ length: 9 }, (_, i) => i + 1),
}) => {
  return (
    <div className="max-w-[13rem] grid grid-cols-3 grid-rows-4 gap-4">
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
  );
};

export default NumberPad;
