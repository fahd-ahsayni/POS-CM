import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import Drawer from "../../Drawer";
import { StepContent } from "./components/StepContent";
import { ComboProvider, useCombo } from "./context/ComboContext";
import { useComboLogic } from "./hooks/useComboLogic";
import { BeatLoader } from "react-spinners";

function ComboContent() {
  const { selectedCombo } = useLeftViewContext();
  console.log("selectedCombo", selectedCombo);
  const { currentStep, selections } = useCombo();
  const { handleNavigation } = useCombo();
  const { handleFinish, isFinishing, getStepDescription } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

  console.log("currentStep", currentStep);
  console.log("selections", selections);

  if (!selectedCombo) return null;

  const isLastStep = currentStep === selectedCombo.steps.length - 1;
  const currentStepData = selectedCombo.steps[currentStep];

  const handleNextOrFinish = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      handleNavigation("next");
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
            onClick={() => handleNavigation("previous")}
            disabled={isFinishing}
          >
            Previous
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={handleNextOrFinish}
          disabled={isFinishing}
        >
          {isLastStep ? (isFinishing ? <BeatLoader color="#fff" size={8} /> : "Finish") : "Next"}
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
    <ComboProvider>
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
