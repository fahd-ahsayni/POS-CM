import { WaitingOrder } from "@/types/waitingOrders";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/assets/figma-icons";

interface OrderActionsProps {
  order: WaitingOrder;
}

export default function OrderActions({ order }: OrderActionsProps) {
  const handleDeleteOrder = () => {
    console.log("delete order", order);
  };
  return (
    <Button variant="link" size="icon" onClick={handleDeleteOrder}>
      <TrashIcon className="w-5 h-5 fill-primary-red" />
    </Button>
  );
}
