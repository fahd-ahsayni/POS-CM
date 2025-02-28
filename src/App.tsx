import HandleApp from "./app/HandleApp";
import GlobalVirtualKeyboard from "./components/keyboard/GlobalVirtualKeyboard";
import { VirtualKeyboardProvider } from "./components/keyboard/VirtualKeyboardGlobalContext";
import { Toaster } from "./components/ui/toaster";
import NoMobileResponsive from "./page/NoMobileResponsive";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OrderProvider } from "@/components/global/drawers/order-details/context/OrderContext";
import OrderDetails from "@/components/global/drawers/order-details/OrderDetails";

export default function App() {
  return (
    <ErrorBoundary>
      <ContextsProvider>
        <VirtualKeyboardProvider>
          <OrderProvider>
            <Toaster />
            <main>
              <div className="block md:hidden">
                <NoMobileResponsive />
              </div>
              <div className="hidden md:block">
                <Fonts>
                  <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
                    <HandleApp />
                  </ThemeProvider>
                </Fonts>
              </div>
            </main>
            <OrderDetails />
            <GlobalVirtualKeyboard />
          </OrderProvider>
        </VirtualKeyboardProvider>
      </ContextsProvider>
    </ErrorBoundary>
  );
}
