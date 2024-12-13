import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SidebarMobile from "./components/SidebarMobile";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex relative w-screen h-screen overflow-hidden">
      {/* Mobile menu */}
      <SidebarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <div className="flex flex-1 flex-col">
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
