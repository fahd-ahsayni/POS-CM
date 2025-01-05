import NumberPad from "@/components/global/NumberPad";
import { TypographyH1 } from "@/components/ui/typography";
import { useCoasterCall } from "@/components/views/home/right-section/hooks/useCoasterCall";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectOrder } from "@/store/slices/order/createOrder";

export default function CoasterCallNumberDisplay({ fixedLightDark }: { fixedLightDark?: boolean }) {
  const { number, handleNumberClick } = useCoasterCall();
  const orderState = useSelector(selectOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="flex flex-col justify-center items-center"
    >
      <TypographyH1 className="text-center font-medium tracking-wider mb-6">
        {orderState.coaster_call || number || "0"}
      </TypographyH1>

      <NumberPad onNumberClick={handleNumberClick} fixLightDark={fixedLightDark} />
    </motion.div>
  );
}
