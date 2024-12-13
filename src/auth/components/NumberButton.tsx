import { HTMLMotionProps, motion } from "framer-motion";

export default function NumberButton({ ...props }: HTMLMotionProps<"button">) {
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
