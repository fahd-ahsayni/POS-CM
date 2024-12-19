import { AppDispatch, RootState } from "@/store";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { LoadingFullScreen } from "../global/loading";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.generalData.status);
  const error = useSelector((state: RootState) => state.generalData.error);
  const navigate = useNavigate();

  useEffect(() => {
    const posId = localStorage.getItem("posId");
    if (posId) {
      dispatch(fetchGeneralData(posId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (status === "loading") return <LoadingFullScreen />;

  return (
    <div className="flex relative w-screen h-screen overflow-hidden">
      <div className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30" />

      {/* Mobile menu */}
      {/* <SidebarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      /> */}

      {/* Content area */}
      <div className="flex flex-1 flex-col relative z-10">
        <Navbar setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-y-hidden">
          <Outlet />
        </div>
      </div>

      {/* Narrow sidebar */}
      <Sidebar />
    </div>
  );
}
