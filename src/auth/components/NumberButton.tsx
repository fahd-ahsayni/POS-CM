import { HTMLMotionProps, motion } from "framer-motion";

export default function NumberButton({ ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, borderRadius: "50%" }}
      transition={{ duration: 0.1 }}
      className="bg-zinc-800/50 text-lg text-gray-50 border h-14 w-14 flex items-center justify-center border-zinc-800 rounded-lg shadow-sm shadow-black/5 hover:bg-zinc-800 hover:text-white"
      {...props}
    >
      {props.children}
    </motion.button>
  );
}
