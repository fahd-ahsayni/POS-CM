import { useTheme } from "@/providers/themeProvider";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Props {
  currentLength: number;
  incorrectPasscode?: boolean;
}

export default function CirclesAnimation({
  currentLength,
  incorrectPasscode,
}: Props) {
  const { theme } = useTheme();
  const [internalCurrentLength, setInternalCurrentLength] = useState(currentLength);
  const [isError, setIsError] = useState(false);

  // Update internal state when currentLength changes (not during error state)
  useEffect(() => {
    if (!incorrectPasscode) {
      setInternalCurrentLength(currentLength);
      setIsError(false);
    }
  }, [currentLength, incorrectPasscode]);

  // Handle error state
  useEffect(() => {
    if (incorrectPasscode) {
      setIsError(true);
      
      const timer = setTimeout(() => {
        setIsError(false);
        setInternalCurrentLength(currentLength);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [incorrectPasscode, currentLength]);

  // Define colors based on theme and error state
  const filledColor = isError 
    ? "#FB0000" // iOS-style red for error
    : theme === "dark" ? "#FFFFFF" : "#000000";
  
  const emptyColor = theme === "dark" ? "#444444" : "#D1D1D6"; // iOS-style empty dot colors

  return (
    <div className="flex justify-center gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            backgroundColor: index < internalCurrentLength ? filledColor : emptyColor,
            scale: index < internalCurrentLength ? 1.1 : 1,
            opacity: index < internalCurrentLength ? 1 : 1,
          }}
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="w-3 h-3 rounded-full"
        />
      ))}
    </div>
  );
}
