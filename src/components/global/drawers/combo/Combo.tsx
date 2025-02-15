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

function ComboContent() {
  const { selectedCombo } = useLeftViewContext();
  const { currentStep, setCurrentStep, handleSelect } = useCombo(); // added handleSelect
  const { handleNavigation } = useCombo();
  const { handleFinish, isFinishing, getStepDescription } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

  const steps =
    selectedCombo?.steps.map((step: any, index: number) => ({
      number: index + 1,
      label: `Step ${index + 1}`,
      name: step.name,
    })) || [];

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
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, currentStepData, isLastStep]);

  // New effect: For a single required step auto-select and finish.
  useEffect(() => {
    if (
      selectedCombo &&
      selectedCombo.steps.length === 1 &&
      currentStepData &&
      currentStepData.is_required &&
      !currentStepData.is_supplement &&
      currentStep === 0
    ) {
      if (currentStepData.product_variant_ids.length > 0) {
        // Auto-select the first variant if not already selected.
        handleSelect(
          currentStepData.product_variant_ids[0],
          currentStepData.is_supplement,
          currentStepData.is_required,
          currentStepData.number_of_products
        );
      }
      const timeoutId = setTimeout(() => {
        handleFinish();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCombo, currentStepData, currentStep, handleSelect, handleFinish]);

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
