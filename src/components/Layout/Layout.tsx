import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SidebarMobile from "./components/SidebarMobile";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex relative w-screen h-screen overflow-hidden">
      <div className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30" />

      {/* Mobile menu */}
      <SidebarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <div className="flex flex-1 flex-col relative z-10">
        <Navbar setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-y-auto">
          <Outlet />
        </div>
      </div>
      
      {/* Narrow sidebar */}
      <Sidebar />
    </div>
  );
}
