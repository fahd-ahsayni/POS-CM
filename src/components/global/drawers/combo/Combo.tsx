import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import Drawer from "../../Drawer";
import { StepContent } from "./components/StepContent";
import { ComboProvider } from "./context/ComboContext";
import { useCombo } from "./context/ComboContext";
import { useComboLogic } from "./hooks/useComboLogic";

function ComboContent() {
  const { selectedCombo } = useLeftViewContext();
  console.log("selectedCombo", selectedCombo);
  const { currentStep, selections } = useCombo();
  const { handleNavigation } = useCombo();
  const { handleFinish } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

  const { getStepDescription } = useComboLogic(
    currentStep,
    selectedCombo?.steps[currentStep]
  );

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
          <span className="font-semibold text-white">{currentStep + 1}</span> of{" "}
          <span className="font-semibold text-white">
            {selectedCombo.steps.length}
          </span>
        </TypographySmall>
      </header>
      <TypographySmall className="mb-4">
        {getStepDescription(currentStepData)}
      </TypographySmall>
      <main className="flex-1 overflow-auto">
        {currentStepData && <StepContent step={currentStepData} />}
      </main>

      <footer className="flex gap-2 mt-4">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={() => handleNavigation("previous")}
          >
            Previous
          </Button>
        )}
        <Button className="flex-1" onClick={handleNextOrFinish}>
          {isLastStep ? "Finish" : "Next"}
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
