import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import CoasterCallNumberDisplay from "@/components/views/home/right-section/layouts/CoasterCallNumberDisplay";
import { selectOrder } from "@/store/slices/order/create-order.slice";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useCoasterCall } from "../hooks/useCoasterCall";

export default function CoasterCall() {
  const { setViews } = useRightViewContext();
  const order = useSelector(selectOrder);
  const { isLoading, handleConfirm } = useCoasterCall();

  const handleConfirmClick = async () => {
    if (order.coaster_call !== null) {
      const success = await handleConfirm();
      if (success) {
        setViews(ORDER_SUMMARY_VIEW);
      }
    }
  };

  const handleCancel = () => {
    setViews(TYPE_OF_ORDER_VIEW);
  };

  return (
    <div className="flex flex-col justify-start h-full">
      <TypographyH3 className="font-medium max-w-md text-balance">
        Enter the beeper number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center h-full relative">
        <CoasterCallNumberDisplay />
        <div className="flex gap-x-4 w-full absolute bottom-0">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => handleCancel()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirmClick}
            disabled={order.coaster_call === null || isLoading}
          >
            {isLoading ? (
              <>
                <BeatLoader color="#fff" size={8} />
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
