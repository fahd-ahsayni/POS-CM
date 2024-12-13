import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SidebarMobile from "./components/SidebarMobile";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      {/* Mobile menu */}
      <SidebarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-hidden">
          <Outlet />
        </div>
      </div>

      {/* Narrow sidebar */}
      <Sidebar />
    </div>
  );
}
