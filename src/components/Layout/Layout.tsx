import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SidebarMobile from "./components/SidebarMobile";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import { RootState } from "@/store";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.generalData.status);
  const error = useSelector((state: RootState) => state.generalData.error);

  useEffect(() => {
    const posId = localStorage.getItem("posId");
    if (posId) {
      dispatch(fetchGeneralData(posId));
    }
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

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
