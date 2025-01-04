import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { useCoasterCall } from "@/components/views/home/right-section/hooks/useCoasterCall";
import CoasterCallNumberDisplay from "@/components/views/home/right-section/layouts/CoasterCallNumberDisplay";
import { ORDER_SUMMARY_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";

export default function CoasterCall() {
  const { handleSubmit } = useCoasterCall();
  const { setViews } = useRightViewContext();

  const handleConfirm = () => {
    handleSubmit();
    setViews(ORDER_SUMMARY_VIEW);
  };

  return (
    <div className="flex flex-col justify-start h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the beeper number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center -mt-20 h-full relative">
        <CoasterCallNumberDisplay />
        <div className="flex gap-x-4 w-full mt-6">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => handleSubmit()}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
