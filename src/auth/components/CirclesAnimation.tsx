import { motion } from "framer-motion";

interface Props {
  currentLength: number;
}

export default function CirclesAnimation({ currentLength }: Props) {
  return (
    <div className="flex justify-center gap-3">
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
    </div>
  );
}
