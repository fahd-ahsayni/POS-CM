import { OrderLinesProvider } from "@/components/views/home/right-section/contexts/orderLinesContext";
import { RightViewProvider } from "@/components/views/home/right-section/contexts/rightViewContext";
import { LeftViewProvider } from "@/components/views/home/left-section/contexts/leftViewContext";
import { ReactNode } from "react";

export default function ContextsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OrderLinesProvider>
      <RightViewProvider>
        <LeftViewProvider>{children}</LeftViewProvider>
      </RightViewProvider>
    </OrderLinesProvider>
  );
}
