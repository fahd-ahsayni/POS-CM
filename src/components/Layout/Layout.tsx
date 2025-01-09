import { updateOrder } from "@/functions/updateOrder";
import { AppDispatch, RootState } from "@/store";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import { fetchPosData } from "@/store/slices/data/posSlice";
import { memo, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { LoadingFullScreen } from "../global/loading";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status: generalStatus, error: generalError } = useSelector(
    (state: RootState) => ({
      status: state.generalData.status,
      error: state.generalData.error,
    }),
    shallowEqual
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const posId = localStorage.getItem("posId");
      if (!posId) {
        navigate("/select-pos");
        return;
      }

      try {
        await Promise.all([
          dispatch(fetchGeneralData(posId)),
          dispatch(fetchPosData()),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    initializeData();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (generalStatus === "failed") {
      navigate("/login");
    }
  }, [generalStatus, navigate]);

  useEffect(() => {
    const shiftId = localStorage.getItem("shiftId");
    if (shiftId) {
      dispatch(updateOrder({ shift_id: shiftId }));
    }
  }, [dispatch]);

  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");
    const timer = !isFirstRender
      ? setTimeout(() => {
          localStorage.setItem("firstRender", "true");
          setIsLoading(false);
          window.location.reload();
        }, 3000)
      : setIsLoading(false);

    return () => {
      if (timer && typeof timer === "number") {
        clearTimeout(timer);
      }
    };
  }, []);

  const BackgroundDecoration = () => (
    <div
      className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30"
      aria-hidden="true"
    />
  );

  const MainContent = () => (
    <main className="flex flex-1 flex-col relative z-10">
      <Navbar />
      <div className="flex flex-1 items-stretch overflow-y-hidden">
        <Outlet />
      </div>
    </main>
  );

  const content = useMemo(
    () => (
      <div className="flex relative w-screen h-screen overflow-hidden">
        <BackgroundDecoration />
        <MainContent />
        <Sidebar />
      </div>
    ),
    []
  );

  if (isLoading) return <LoadingFullScreen />;
  if (generalError) return <div>Error: {generalError}</div>;
  return content;
};

export default memo(Layout);
