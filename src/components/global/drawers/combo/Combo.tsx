import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { BeatLoader } from "react-spinners";
import Drawer from "../layout/Drawer";
import { StepContent } from "./components/StepContent";
import { ComboProvider, useCombo } from "./context/ComboContext";
import { useComboLogic } from "./hooks/use-combo-logic";
import { loadingColors } from "@/preferences";
import { useEffect, useState } from "react";
import AnimatedStepper from "@/components/global/AnimatedStepper";
import { ScrollArea } from "@/components/ui/scroll-area";

function ComboContent() {
  const { selectedCombo } = useLeftViewContext();
  const { currentStep, setCurrentStep } = useCombo();
  const { handleNavigation } = useCombo();
  const { handleFinish, isFinishing, getStepDescription } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

  // Add this effect to handle single required step
  useEffect(() => {
    if (
      selectedCombo?.steps.length === 1 &&
      selectedCombo.steps[0].is_required &&
      !selectedCombo.steps[0].is_supplement
    ) {
      const timeoutId = setTimeout(() => {
        handleFinish();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCombo, handleFinish]);

  const steps =
    selectedCombo?.steps.map((_: any, index: number) => ({
      number: index + 1,
      label: `Step ${index + 1}`,
    })) || [];

  const [visitedSteps, setVisitedSteps] = useState(new Set());

  if (!selectedCombo) return null;

  // Don't render the UI for single required step
  if (
    selectedCombo.steps.length === 1 &&
    selectedCombo.steps[0].is_required &&
    !selectedCombo.steps[0].is_supplement
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <BeatLoader color={loadingColors.primary} size={8} />
      </div>
    );
  }

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
      }, 50);

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
      <AnimatedStepper
        steps={steps}
        currentStep={currentStep + 1}
        onStepClick={(stepNumber) => setCurrentStep(stepNumber - 1)}
      />
      <TypographySmall className="mb-2">
        {getStepDescription(currentStepData)}
      </TypographySmall>
      <ScrollArea className="flex-1 pr-2">
        {currentStepData && <StepContent step={currentStepData} />}
      </ScrollArea>

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
        classNames="max-w-md bg-neutral-bright-grey"
      >
        <ComboContent />
      </Drawer>
    </ComboProvider>
  );
}
