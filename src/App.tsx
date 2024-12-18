import { ToastContainer } from "react-toastify";
import HandleApp from "./app/HandleApp";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";

export default function App() {
  return (

        <Fonts>
          <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
            <ToastContainer />
            <HandleApp />
          </ThemeProvider>
        </Fonts>
  
  );
}
