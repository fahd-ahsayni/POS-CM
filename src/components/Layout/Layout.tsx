import { getGeneralData } from "@/api/services";
import { loadingColors } from "@/preferences";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchPosData, selectPosData } from "@/store/slices/data/pos.slice";
import { PosData } from "@/types/pos.types";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const BackgroundDecoration: FC = () => (
  <div
    className="absolute rounded-full -top-48 -right-48 w-[320px] h-[320px] bg-primary-red/50 blur-3xl"
    aria-hidden="true"
  />
);

const MainContent: FC = () => (
  <main className="flex flex-1 flex-col relative z-10">
    <Navbar />
    <div className="flex flex-1 items-stretch overflow-y-hidden">
      <Outlet />
    </div>
  </main>
);

const Layout: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPos, setCurrentPos] = useState<PosData | null>(null);

  const initializeLayout = useCallback(async () => {
    const hasGeneralData = localStorage.getItem("generalData");
    if (hasGeneralData) {
      setLoading(false);
      return;
    }

    try {
      await dispatch(fetchPosData()).unwrap();
      const savedPosId = localStorage.getItem("posId");
      const posData = selectPosData(store.getState());
      const foundPos = posData.pos.find((p) => p._id === savedPosId);

      if (!foundPos?._id) {
        throw new Error("Invalid POS data");
      }

      setCurrentPos(foundPos);

      const response = await getGeneralData(foundPos._id);
      if (response?.data) {
        localStorage.setItem("generalData", JSON.stringify(response.data));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize layout";
      console.error("Failed to initialize layout:", error);
      setError(errorMessage);
      navigate("/error");
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    initializeLayout();
  }, []);

  useEffect(() => {
    if (currentPos?.shift?._id) {
      localStorage.setItem("shiftId", currentPos.shift?._id);
    }
  }, [currentPos]);

  if (isLoading) {
    return (
      <div className="bg-background w-screen h-screen flex items-center justify-center">
        <BeatLoader color={loadingColors.secondary} size={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex relative w-screen h-screen overflow-hidden">
      <BackgroundDecoration />
      <MainContent />
      <Sidebar />
    </div>
  );
};

// Memoize sub-components for performance
const MemoizedBackgroundDecoration = memo(BackgroundDecoration);
const MemoizedMainContent = memo(MainContent);

// Export memoized version of Layout
export default memo(Layout);

// Add display names for better debugging
MemoizedBackgroundDecoration.displayName = "BackgroundDecoration";
MemoizedMainContent.displayName = "MainContent";
Layout.displayName = "Layout";
