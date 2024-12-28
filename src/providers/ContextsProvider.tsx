import { OrderProvider } from "@/components/global/drawers/order-details/context/OrderContext";
import { LeftViewProvider } from "@/components/views/home/left-section/contexts/leftViewContext";
import { OrderLinesProvider } from "@/components/views/home/right-section/contexts/orderLinesContext";
import { RightViewProvider } from "@/components/views/home/right-section/contexts/rightViewContext";
import { ReactNode } from "react";

export default function ContextsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OrderLinesProvider>
      <RightViewProvider>
        <LeftViewProvider>
          <OrderProvider>{children}</OrderProvider>
        </LeftViewProvider>
      </RightViewProvider>
    </OrderLinesProvider>
  );
}
