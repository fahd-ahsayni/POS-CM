import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { currency } from "@/preferences";
import Drawer from "../layout/Drawer";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PaymentHistoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId?: string;
  selectedOrder: any; // TODO: Add proper type
}

export default function PaymentHistory({
  open,
  setOpen,
  selectedOrder,
}: PaymentHistoryProps) {
  const payments = selectedOrder.payments;

  console.log(selectedOrder);
  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title={`Payment History`}
      position="right"
      description="View payment history for this order"
      classNames="max-w-md bg-neutral-bright-grey"
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-y-2.5">
          {payments?.map((payement: any) => (
            <Card className="p-4 flex flex-col justify-between dark:!bg-primary-black gap-y-4">
              <span className="flex items-center justify-between gap-x-2">
                <Badge>{payement.payment_method_id.name}</Badge>
                <TypographySmall className="dark:text-white/40 text-primary-black/30">
                  {format(new Date(payement.updatedAt), "dd MMM yyyy - HH:mm")}
                </TypographySmall>
              </span>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <TypographyP>
                    {Number(payement.amount).toFixed(2)} {currency.currency}
                  </TypographyP>
                </div>
                {payement.payment_method_id.is_cmi && (
                  <div className="flex items-center gap-x-2.5">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Duplicate</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Drawer>
  );
}
