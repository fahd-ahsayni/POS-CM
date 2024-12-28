import { useTheme } from "@/providers/themeProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  currentLength: number;
  incorrectPasscode?: boolean;
  isFixedLightDark?: boolean;
}

export default function CirclesAnimation({
  currentLength,
  incorrectPasscode,
  isFixedLightDark = false,
}: Props) {
  const { theme } = useTheme();
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (incorrectPasscode) {
      setIsShaking(true);
      // Reset shaking after animation completes (2 repetitions)
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 800); // Increased to 800ms to accommodate two repetitions

      return () => clearTimeout(timer);
    }
  }, [incorrectPasscode]);

  const currentColor = () => {
    if (theme === "light") {
      if (isFixedLightDark) {
        return "#121212";
      }
      return "#1E1E1E";
    } else if (theme === "dark") {
      return "#ffffff";
    }
  };

  const notCurrentColor = () => {
    if (theme === "dark") {
      if (isFixedLightDark) {
        return "#121212";
      }
      return "#1E1E1E";
    } else if (theme === "light") {
      return "#7E7E7E";
    }
  };

  return (
    <motion.div
      className="flex justify-center gap-3"
      animate={
        isShaking
          ? {
              x: [-10, 10, -10, 10, -5, 5, 0],
              transition: {
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 10,
                repeat: 1, // Add one repeat (will play twice total)
                repeatType: "reverse" // Makes the animation smoother between repeats
              },
            }
          : undefined
      }
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          animate={{
            backgroundColor:
              index < currentLength ? currentColor() : notCurrentColor(),
          }}
          transition={{
            duration: 0.2,
          }}
          className="w-3 h-3 rounded-full bg-neutral-dark-grey"
        />
      ))}
    </motion.div>
  );
}
