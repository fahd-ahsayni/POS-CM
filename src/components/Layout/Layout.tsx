import { updateOrder } from "@/functions/updateOrder";
import { useAppDispatch } from "@/store/hooks";
import { memo, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      const posId = localStorage.getItem("posId");
      if (!posId) {
        navigate("/select-pos");
        return;
      }

      const generalData = localStorage.getItem("generalData");
      if (!generalData) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    };

    initializeData();
    localStorage.removeItem("loadedOrder");
  }, []);

  useEffect(() => {
    const shiftId = localStorage.getItem("shiftId");
    if (shiftId) {
      dispatch(updateOrder({ shift_id: shiftId }));
    }
  }, [dispatch]);

  const BackgroundDecoration = () => (
    <div
      className="absolute rounded-full -top-48 -right-48 w-[320px] h-[320px] bg-primary-red/50 blur-3xl"
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
  return content;
};

export default memo(Layout);
