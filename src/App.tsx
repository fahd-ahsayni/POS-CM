import HandleApp from "./app/HandleApp";
import GlobalVirtualKeyboard from "./components/keyboard/GlobalVirtualKeyboard";
import { VirtualKeyboardProvider } from "./components/keyboard/VirtualKeyboardGlobalContext";
import NoMobileResponsive from "./page/NoMobileResponsive";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (
    <VirtualKeyboardProvider>

      <main>
        <div className="block md:hidden">
          <NoMobileResponsive />
        </div>
        <div className="hidden md:block">
          <ContextsProvider>
            <Fonts>
              <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
                <HandleApp />
              </ThemeProvider>
            </Fonts>
          </ContextsProvider>
        </div>
      </main>

      {/* Global virtual keyboard is rendered here */}
      <GlobalVirtualKeyboard />
    </VirtualKeyboardProvider>
  );
}
