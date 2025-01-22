import NumberPad from "@/components/global/NumberPad";
import { TypographyH1 } from "@/components/ui/typography";
import { useCoasterCall } from "@/components/views/home/right-section/hooks/useCoasterCall";
import { selectOrder } from "@/store/slices/order/create-order.slice";
import { useSelector } from "react-redux";

export default function CoasterCallNumberDisplay({
  fixedLightDark,
}: {
  fixedLightDark?: boolean;
}) {
  const { number, handleNumberClick } = useCoasterCall();
  const orderState = useSelector(selectOrder);

  return (
    <div className="flex flex-col justify-center items-center">
      <TypographyH1 className="text-center font-medium tracking-wider mb-6">
        {orderState.coaster_call || number || "0"}
      </TypographyH1>

      <NumberPad
        onNumberClick={handleNumberClick}
        fixLightDark={fixedLightDark}
      />
    </div>
  );
}
