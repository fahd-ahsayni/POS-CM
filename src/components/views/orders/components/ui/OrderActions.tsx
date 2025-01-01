import { WaitingOrder } from "@/types/waitingOrders";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/assets/figma-icons";

interface OrderActionsProps {
  order: WaitingOrder;
}

export default function OrderActions({ order }: OrderActionsProps) {
  return (
    <Button variant="link" size="icon">
      <TrashIcon className="w-5 h-5 fill-primary-red" />
    </Button>
  );
}
