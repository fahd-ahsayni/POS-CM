import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AnimatedCheck from "../design/AnimatedCheck";

// Animation constants and variants
const TRANSITION_DURATION = 0.1;
const circleVariants = {
  current: { scale: 1, transition: { duration: TRANSITION_DURATION } },
  default: { scale: 1, transition: { duration: TRANSITION_DURATION } },
};
const textVariants = {
  current: { opacity: 1, transition: { duration: TRANSITION_DURATION } },
  default: { opacity: 0.5, transition: { duration: TRANSITION_DURATION } },
};
const lineVariants = {
  completed: {
    backgroundColor: "hsl(var(--primary))",
    transition: { duration: TRANSITION_DURATION },
  },
  pending: {
    backgroundColor: "hsl(var(--muted))",
    transition: { duration: TRANSITION_DURATION },
  },
};

interface Step {
  number: number;
  label: string;
  name: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

const AnimatedStepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Optimized scroll function using useCallback
  const scrollToCurrentStep = useCallback((stepIndex: number) => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea && scrollArea.children.length) {
      const stepElement = scrollArea.children[stepIndex] as HTMLElement;
      if (stepElement) {
        stepElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToCurrentStep(currentStep - 1);
  }, [currentStep, scrollToCurrentStep]);

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex items-center py-2" ref={scrollAreaRef}>
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  onClick={() => onStepClick(step.number)}
                  className={cn(
                    "h-9 flex items-center justify-center text-sm font-semibold cursor-pointer",
                    step.number === currentStep
                      ? "w-auto bg-primary-red text-primary-foreground shadow-lg shadow-primary-red/40 text-white rounded-lg px-4 relative"
                      : step.number < currentStep
                      ? "w-9 rounded-lg bg-primary-red text-white"
                      : "w-9 rounded-lg bg-primary-black dark:bg-white/60 dark:text-primary-black text-secondary-white opacity-50"
                  )}
                  initial="default"
                  animate={step.number === currentStep ? "current" : "default"}
                  variants={circleVariants}
                >
                  {step.number < currentStep ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: TRANSITION_DURATION }}
                    >
                      <AnimatedCheck className="w-5 h-5" />
                    </motion.div>
                  ) : step.number > currentStep ? (
                    step.number
                  ) : (
                    step.name
                  )}
                </motion.div>
                <motion.div
                  className={cn(
                    "mt-2 text-xs text-center w-20",
                    step.number === currentStep
                      ? "text-black font-bold"
                      : "text-black"
                  )}
                  initial="default"
                  animate={step.number === currentStep ? "current" : "default"}
                  variants={textVariants}
                >
                  <span className="opacity-0">{step.label}</span>
                </motion.div>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  className="w-10 h-[2px] mb-5 -mx-5"
                  initial="pending"
                  animate={step.number <= currentStep ? "completed" : "pending"}
                  variants={lineVariants}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default AnimatedStepper;
