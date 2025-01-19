import { useEffect } from "react";
import TrueFocus from "../design/TrueFocus";
import Logo from "../Layout/components/Logo";
import { TextShimmer } from "../ui/text-shimmer";
import { TypographyP } from "../ui/typography";

export function LoadingFullScreen({
  onLoadingComplete,
}: {
  onLoadingComplete?: () => void;
}) {
  useEffect(() => {
    if (onLoadingComplete) {
      const timer = setTimeout(onLoadingComplete, 2000);
      return () => clearTimeout(timer);
    }
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
      </div>
    </div>
  );
}
