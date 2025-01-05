import AddClient from "@/components/global/drawers/add-client/AddClient";
import Drop from "@/components/global/drawers/drop/Drop";
import { Card } from "@/components/ui/card";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarNavigation, sidebarPagesLink } from "../constants";

interface SidebarItemProps {
  item: {
    name: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  pathname: string;
  theme: string;
  onClick?: () => void;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pathname,
  theme,
  onClick,
  isActive: forcedActive,
}) => {
  const navigate = useNavigate();
  const isActive = forcedActive || pathname === item.route;

  return (
    <Card
      onClick={
        onClick || (item.route !== "#" ? () => navigate(item.route) : undefined)
      }
      key={item.name}
      className={cn(
        isActive
          ? "!bg-primary-red text-white !border-interactive-vivid-red shadow-md shadow-primary-red/60 dark:shadow-primary-red/50"
          : "shadow-md shadow-primary-black/20 dark:shadow-black/70",
        "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium transition-all duration-150",
        item.name === "Clients" &&
          onClick === undefined &&
          "opacity-50 cursor-not-allowed"
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5",
          isActive
            ? "text-white"
            : theme === "dark"
            ? "text-white"
            : "text-black"
        )}
      />
      <span className="mt-2 text-center">{item.name}</span>
    </Card>
  );
};

export default function Sidebar() {
  const { views } = useRightViewContext();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [openClientDrawer, setOpenClientDrawer] = useState(false);
  const [openDropDrawer, setOpenDropDrawer] = useState(false);

  const handleClientClick = () => {
    if (views === ORDER_SUMMARY_VIEW) {
      setOpenClientDrawer(true);
    }
  };

  const handleDropClick = () => {
    setOpenDropDrawer(true);
  };

  return (
    <div className="hidden w-full h-screen md:block z-10">
      <AddClient open={openClientDrawer} setOpen={setOpenClientDrawer} />
      <Drop open={openDropDrawer} setOpen={setOpenDropDrawer} />
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-between py-3 px-2">
          {/* Pages Links */}
          {sidebarPagesLink.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              pathname={pathname}
              theme={theme}
            />
          ))}

          {/* Navigation Items */}
          {sidebarNavigation.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              pathname={pathname}
              theme={theme}
              onClick={
                item.name === "Clients"
                  ? views === ORDER_SUMMARY_VIEW
                    ? handleClientClick
                    : undefined
                  : item.name === "Drop"
                  ? handleDropClick
                  : item.onClick
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
