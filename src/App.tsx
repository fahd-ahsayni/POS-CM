import HandleApp from "./app/HandleApp";
import Keyboard from "./components/global/keyboard/Keyboard";
import ContextsProvider from "./providers/ContextsProvider";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (
    <ContextsProvider>
      <Fonts>
        <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
          <Keyboard />
          <HandleApp />
        </ThemeProvider>
      </Fonts>
    </ContextsProvider>
  );
}
