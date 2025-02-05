import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { BeatLoader } from "react-spinners";
import Drawer from "../../Drawer";
import { StepContent } from "./components/StepContent";
import { ComboProvider, useCombo } from "./context/ComboContext";
import { useComboLogic } from "./hooks/use-combo-logic";
import { loadingColors } from "@/preferences";
import { useEffect, useState } from "react";

function ComboContent() {
  const { selectedCombo } = useLeftViewContext();
  const { currentStep } = useCombo();
  const { handleNavigation } = useCombo();
  const { handleFinish, isFinishing, getStepDescription } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

  const [visitedSteps, setVisitedSteps] = useState(new Set());

  if (!selectedCombo) return null;

  const isLastStep = currentStep === selectedCombo.steps.length - 1;
  const currentStepData = selectedCombo.steps[currentStep];

  useEffect(() => {
    if (
      currentStepData &&
      currentStepData.is_required &&
      !currentStepData.is_supplement &&
      !visitedSteps.has(currentStep)
    ) {
      const timeoutId = setTimeout(() => {
        if (!isLastStep) {
          setVisitedSteps((prev) => new Set(prev).add(currentStep)); // Mark step as visited
          handleNavigation("next");
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, currentStepData, isLastStep]);

  const handleNavigationWithTracking = (direction: "next" | "previous") => {
    if (direction === "next") {
      handleNavigation("next");
    } else {
      handleNavigation("previous");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4">
        <TypographySmall className="text-neutral-dark-grey">
          Step{" "}
          <span className="font-semibold dark:text-white text-primary-black">
            {currentStep + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold dark:text-white text-primary-black">
            {selectedCombo.steps.length}
          </span>
        </TypographySmall>
      </header>
      <TypographySmall className="mb-4 font-medium">
        {getStepDescription(currentStepData)}
      </TypographySmall>
      <main className="flex-1 overflow-auto pr-2">
        {currentStepData && <StepContent step={currentStepData} />}
      </main>

      <footer className="flex gap-2 mt-4">
        {currentStep > 0 && (
          <Button
            variant="secondary"
            className="flex-1 bg-white dark:bg-white/10 shadow border border-border"
            onClick={() => handleNavigationWithTracking("previous")}
            disabled={isFinishing}
          >
            Previous
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() => {
            if (isLastStep) {
              handleFinish();
            } else {
              handleNavigationWithTracking("next");
            }
          }}
          disabled={isFinishing}
        >
          {isLastStep ? (
            isFinishing ? (
              <BeatLoader color={loadingColors.primary} size={8} />
            ) : (
              "Finish"
            )
          ) : (
            "Next"
          )}
        </Button>
      </footer>
    </div>
  );
}

export default function Combo() {
  const { openDrawerCombo, setOpenDrawerCombo, selectedCombo } =
    useLeftViewContext();

  if (!selectedCombo) return null;

  return (
    <ComboProvider totalSteps={selectedCombo.steps.length}>
      <Drawer
        open={openDrawerCombo}
        setOpen={setOpenDrawerCombo}
        title={selectedCombo.name}
        position="left"
      >
        <ComboContent />
      </Drawer>
    </ComboProvider>
  );
}
