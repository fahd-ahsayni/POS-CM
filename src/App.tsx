import HandleApp from "./app/HandleApp";
import { KeyboardProvider } from "./components/global/keyboard/context/KeyboardContext";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (
    <ContextsProvider>
      <KeyboardProvider>
        <Fonts>
          <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
            <HandleApp />
          </ThemeProvider>
        </Fonts>
      </KeyboardProvider>
    </ContextsProvider>
  );
}
