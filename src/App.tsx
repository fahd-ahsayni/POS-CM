import HandleApp from "./app/HandleApp";
import Keyboard from "./components/global/keyboard/Keyboard";
import NoMobileResponsive from "./page/NoMobileResponsive";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (
    <main>
      <div className="block md:hidden">
        <NoMobileResponsive />
      </div>
      <div className="hidden md:block">
        <ContextsProvider>
          <Fonts>
            <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
              <Keyboard />
              <HandleApp />
            </ThemeProvider>
          </Fonts>
        </ContextsProvider>
      </div>
    </main>
  );
}
