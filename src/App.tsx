import HandleApp from "./app/HandleApp";
import GlobalVirtualKeyboard from "./components/keyboard/GlobalVirtualKeyboard";
import { VirtualKeyboardProvider } from "./components/keyboard/VirtualKeyboardGlobalContext";
import { Toaster } from "./components/ui/toaster";
import NoMobileResponsive from "./page/NoMobileResponsive";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (
    <ContextsProvider>
      <VirtualKeyboardProvider>
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
        <GlobalVirtualKeyboard />
      </VirtualKeyboardProvider>
    </ContextsProvider>
  );
}
