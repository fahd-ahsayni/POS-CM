import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import CoasterCallNumberDisplay from "@/components/views/home/right-section/layouts/CoasterCallNumberDisplay";
import { selectOrder } from "@/store/slices/order/create-order.slice";
import { useSelector } from "react-redux";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";

export default function CoasterCall() {
  const { setViews } = useRightViewContext();
  const order = useSelector(selectOrder);

  const handleConfirm = () => {
    if (order.coaster_call !== null) setViews(ORDER_SUMMARY_VIEW);
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
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={order.coaster_call === null}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
