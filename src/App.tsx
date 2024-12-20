import { ToastContainer } from "react-toastify";
import HandleApp from "./app/HandleApp";
import Fonts from "./providers/Fonts";
import { ThemeProvider } from "./providers/themeProvider";
import HomeProvider from "./components/views/home/HomeProvider";

export default function App() {
  return (
    <HomeProvider>
      <Fonts>
        <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
          <ToastContainer />
          <HandleApp />
        </ThemeProvider>
      </Fonts>
    </HomeProvider>
  );
}
