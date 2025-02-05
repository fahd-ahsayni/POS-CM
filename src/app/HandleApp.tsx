import { loadingColors } from "@/preferences";
import { useTheme } from "@/providers/themeProvider";
import { useAppSelector } from "@/store/hooks";
import { Suspense, lazy } from "react";
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
