import { AppDispatch } from "@/store";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import {
  fetchPosData,
  selectPosData,
  selectPosLoading,
  selectPosError,
} from "@/store/slices/data/posSlice";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { LoadingFullScreen } from "../global/loading";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { RootState } from "@/store";

const Layout = () => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Selectors
  const generalStatus = useSelector(
    (state: RootState) => state.generalData.status
  );
  const generalError = useSelector(
    (state: RootState) => state.generalData.error
  );

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handlers
  const handleMobileMenu = useCallback((value: boolean) => {
    setMobileMenuOpen(value);
  }, []);

  // Effects
  useEffect(() => {
    const posId = localStorage.getItem("posId");
    if (posId) {
      dispatch(fetchGeneralData(posId));
      dispatch(fetchPosData());
    } else {
      navigate("/select-pos");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (generalStatus === "failed") {
      navigate("/login");
    }
  }, [generalStatus, navigate]);

  // Loading state
  if (generalStatus === "loading") {
    return <LoadingFullScreen />;
  }

  // Error state
  if (generalError) {
    return <div>Error: {generalError}</div>;
  }

  return (
    <div className="flex relative w-screen h-screen overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30"
        aria-hidden="true"
      />

      {/* Content area */}
      <main className="flex flex-1 flex-col relative z-10">
        <Navbar setMobileMenuOpen={handleMobileMenu} />

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-y-hidden">
          <Outlet />
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};

export default Layout;
