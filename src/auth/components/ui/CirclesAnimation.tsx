import { motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  currentLength: number;
  incorrectPasscode?: boolean;
}

export default function CirclesAnimation({
  currentLength,
  incorrectPasscode,
}: Props) {
  useEffect(() => {
    console.log(incorrectPasscode);
  }, [incorrectPasscode]);
  return (
    <motion.div
      className="flex justify-center gap-3"
      animate={
        incorrectPasscode
          ? {
              y: [0, -10, 10, -10, 10, -5, 5, 0],
            }
          : undefined
      }
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 10,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          animate={{
            backgroundColor: index < currentLength ? "#f9fafb" : "#262626",
          }}
          transition={{
            duration: 0.2,
          }}
          className="w-3 h-3 rounded-full bg-zinc-800"
        />
      ))}
    </motion.div>
  );
}
