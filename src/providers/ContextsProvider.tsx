import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShiftProvider } from "@/auth/context/ShiftContext";
import { OrderProvider } from "@/components/global/drawers/order-details/context/OrderContext";
import { KeyboardProvider } from "@/components/global/keyboard/context/KeyboardContext";
import { LeftViewProvider } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { OrderLinesProvider } from "@/components/views/home/right-section/contexts/OrderLinesContext";
import { RightViewProvider } from "@/components/views/home/right-section/contexts/RightViewContext";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function ContextsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <ShiftProvider>
          <OrderLinesProvider>
            <RightViewProvider>
              <LeftViewProvider>
                <OrderProvider>{children}</OrderProvider>
              </LeftViewProvider>
            </RightViewProvider>
          </OrderLinesProvider>
        </ShiftProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
