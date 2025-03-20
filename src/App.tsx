import { OrderProvider } from "@/components/global/drawers/order-details/context/OrderContext";
import OrderDetails from "@/components/global/drawers/order-details/OrderDetails";
import HandleApp from "./app/HandleApp";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GlobalVirtualKeyboard from "./components/keyboard/GlobalVirtualKeyboard";
import { VirtualKeyboardProvider } from "./components/keyboard/VirtualKeyboardGlobalContext";
import { Toaster } from "./components/ui/toaster";
import { useLocalStorage } from "./hooks/use-local-storage";
import NoMobileResponsive from "./page/NoMobileResponsive";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  const [withKeyboard] = useLocalStorage<boolean>("withKeyboard", false);

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
            {withKeyboard && <GlobalVirtualKeyboard />}
          </OrderProvider>
        </VirtualKeyboardProvider>
      </ContextsProvider>
    </ErrorBoundary>
  );
}
