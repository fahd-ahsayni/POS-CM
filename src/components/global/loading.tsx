import { useEffect, useState } from "react";
import TrueFocus from "../design/TrueFocus";
import Logo from "../Layout/components/Logo";
import NumberTicker from "../ui/number-ticker";
import { TextShimmer } from "../ui/text-shimmer";
import { TypographyH1, TypographyP } from "../ui/typography";

export function LoadingFullScreen({
  onLoadingComplete,
}: {
  onLoadingComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const totalDuration = 6600; // 6.6 seconds in milliseconds
    const totalSteps = 100; // Using 100 steps for cleaner percentage display
    const timePerStep = totalDuration / totalSteps;

    const progressInterval = setInterval(() => {
      if (currentProgress < totalSteps) {
        currentProgress += 1;
        setProgress(currentProgress);
      } else {
        clearInterval(progressInterval);
        onLoadingComplete?.();
      }
    }, timePerStep);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden relative">
      <div className="fixed top-8 left-0 w-full flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="absolute opacity-25">
          <div className="w-96 h-96 bg-primary-red rounded-full blur-3xl opacity-10 animate-pulse" />
        </div>
        <TrueFocus
          sentence="Caisse Manager"
          manualMode={false}
          blurAmount={5}
          pauseBetweenAnimations={1}
          borderColor="#FB0000"
        />
      </div>
      <div className="flex absolute bottom-8 left-0 w-full flex-col items-center justify-center space-y-2">
        <TypographyP className="text-sm">
          <TextShimmer duration={2}>installing in progress</TextShimmer>
        </TypographyP>
        <TypographyH1>
          <NumberTicker
            value={progress}
            delay={0}
            direction="up"
            springConfig={{ damping: 100, stiffness: 100 }}
            decimalPlaces={0}
          />
        </TypographyH1>
      </div>
    </div>
  );
}
