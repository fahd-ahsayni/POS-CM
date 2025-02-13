import notificationSound from "@/assets/sound/notification.mp3";
import createNewOrderReceivedNotification from "@/components/Layout/components/NewOrderReceived";
import { Button } from "@/components/ui/button";
import useSocket from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { loadingColors } from "@/preferences";
import { useTheme } from "@/providers/themeProvider";
import { useAppSelector } from "@/store/hooks";
import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { Bounce, ToastContainer } from "react-toastify";

// Lazy load components
const LogInPage = lazy(() => import("../auth/LogInPage"));
const SelectPosPage = lazy(() => import("@/auth/SelectPosPage"));
const Layout = lazy(() => import("@/components/Layout/Layout"));
const HomePage = lazy(() => import("./HomePage"));
const OrdersPage = lazy(() => import("./OrdersPage"));
const WaitingOrders = lazy(() => import("./WaitingOrders"));
const CustomerDisplay = lazy(
  () => import("@/components/global/customer-display/CustomerDisplay")
);
const SessionExpired = lazy(() => import("@/components/errors/SessionExpired"));
const ErrorOccurred = lazy(() => import("@/components/errors/ErrorOccurred"));
const BrokenLink = lazy(() => import("@/components/errors/BrokenLink"));
const Test = lazy(() => import("@/Test"));

// Define AppEvents type
type AppEvents = {
  glovo_new_order_created: {
    glovo_pick_up_code: string;
    order_type_image: string;
  };
};

interface AuthState {
  isAuthenticated: boolean;
}

interface RootState {
  auth: AuthState;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const token = localStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function HandleApp() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { on, off } = useSocket<AppEvents>(import.meta.env.VITE_SOCKET_URL);

  useEffect(() => {
    // Preload the audio file
    const audio = new Audio(notificationSound);
    let isMounted = true;

    const handleNewOrder = (data: {
      glovo_pick_up_code: string;
      order_type_image: string;
    }) => {
      if (!import.meta.env.VITE_SOCKET_URL) return;

      // Reset audio position and play
      try {
        audio.currentTime = 0; // Rewind to start
        audio.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            console.warn(
              "Audio playback blocked by browser. Consider user interaction first."
            );
          } else {
            console.error("Audio playback error:", error);
          }
        });
      } catch (error) {
        console.error("Audio initialization error:", error);
      }

      // Show notification
      if (isMounted) {
        toast({
          action: (
            <>
              {createNewOrderReceivedNotification(
                data.glovo_pick_up_code,
                data.order_type_image,
                "glovo_new_order_created"
              )}
            </>
          ),
        });
      }
    };

    // Register event listener
    on("glovo_new_order_created", handleNewOrder);

    return () => {
      // Cleanup
      isMounted = false;
      off("glovo_new_order_created");
      audio.pause();
      audio.remove();
    };
  }, [on, off, notificationSound]);

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme={theme}
        transition={Bounce}
        closeButton={false}
      />
      <Suspense
        fallback={
          <div className="bg-background w-screen h-screen flex items-center justify-center">
            <BeatLoader color={loadingColors.secondary} size={10} />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route
            path="/select-pos"
            element={
              <ProtectedRoute>
                <SelectPosPage />
              </ProtectedRoute>
            }
          />
          <Route path="/customer-display" element={<CustomerDisplay />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="/error" element={<ErrorOccurred />} />
          <Route path="/test" element={<Test />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/waiting-orders" element={<WaitingOrders />} />
          </Route>
          <Route path="*" element={<BrokenLink />} />
        </Routes>
      </Suspense>
    </>
  );
}
