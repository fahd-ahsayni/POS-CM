import { updateOrder } from "@/functions/updateOrder";
import { AppDispatch, RootState } from "@/store";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import { fetchPosData } from "@/store/slices/data/posSlice";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Keyboard from "../global/keyboard/Keyboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Use useMemo for selectors to prevent unnecessary re-renders
  const generalStatus = useSelector(
    (state: RootState) => state.generalData.status,
    shallowEqual
  );
  const generalError = useSelector(
    (state: RootState) => state.generalData.error,
    shallowEqual
  );

  // Combine related effects
  useEffect(() => {
    // Remove the flag immediately to show loading
    localStorage.removeItem("hasSeenCategoryLoading");

    // Set the flag after 2 seconds
    const timer = setTimeout(() => {
      localStorage.setItem("hasSeenCategoryLoading", "true");
    }, 2000);

    const posId = localStorage.getItem("posId");
    if (posId) {
      dispatch(fetchGeneralData(posId));
      dispatch(fetchPosData());
    } else {
      navigate("/select-pos");
    }

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []); // Add dispatch and navigate to deps if needed for strict mode

  useEffect(() => {
    if (generalStatus === "failed") {
      navigate("/login");
    }
  }, [generalStatus, navigate]);

  // Memoize the updateOrder callback
  const handleUpdateOrder = useCallback(() => {
    const shiftId = localStorage.getItem("shiftId");

    // Only dispatch if shiftId exists
    if (shiftId) {
      setTimeout(() => {
        dispatch(updateOrder({ shift_id: shiftId }));
      }, 1000);
    }
  }, [dispatch, localStorage.getItem("shiftId")]);

  useEffect(() => {
    handleUpdateOrder();
  }, [handleUpdateOrder]);

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(
    () => (
      <div className="flex relative w-screen h-screen overflow-hidden">
        <Keyboard />
        <div
          className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30"
          aria-hidden="true"
        />
        <main className="flex flex-1 flex-col relative z-10">
          <Navbar />
          <div className="flex flex-1 items-stretch overflow-y-hidden">
            <Outlet />
          </div>
        </main>
        <Sidebar />
      </div>
    ),
    []
  ); // Add dependencies if needed

  if (generalError) {
    return <div>Error: {generalError}</div>;
  }

  return content;
};

// Memoize the entire component
export default memo(Layout);
