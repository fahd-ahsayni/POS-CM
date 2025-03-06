import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    TypographyP,
    TypographySmall
} from "@/components/ui/typography";
import { currency } from "@/preferences";
import Drawer from "../layout/Drawer";
import { payementsHistory } from "./test";

interface PaymentHistoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId?: string;
}

export default function PaymentHistory({
  open,
  setOpen,
}: PaymentHistoryProps) {
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
          {payementsHistory.map((payement) => (
            <Card className="p-4 flex justify-between !bg-primary-black">
              <div>
                <TypographySmall>{payement.name}</TypographySmall>
                <TypographyP>
                  {Number(payement.mount).toFixed(2)} {currency.currency}
                </TypographyP>
              </div>
              {payement.is_cmi && (
                <div className="flex items-center gap-x-2.5">
                  <Button>Cancel</Button>
                  <Button>Duplicate</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Drawer>
  );
}
