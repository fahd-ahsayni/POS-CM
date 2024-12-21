import { ToastContainer } from "react-toastify";
import HandleApp from "./app/HandleApp";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";
import { KeyboardProvider } from "./components/global/keyboard/context/KeyboardContext";
import ContextsProvider from "./providers/ContextsProvider";

export default function App() {
  return (
    <ContextsProvider>
      <KeyboardProvider>
        <Fonts>
          <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
            <ToastContainer />
            <HandleApp />
          </ThemeProvider>
        </Fonts>
      </KeyboardProvider>
    </ContextsProvider>
  );
}
