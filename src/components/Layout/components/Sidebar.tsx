import AddClient from "@/components/global/drawers/add-client/AddClient";
import Drop from "@/components/global/drawers/drop/Drop";
import StaffList from "@/components/global/drawers/staff-list/StaffList";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useOrderType } from "@/components/views/home/right-section/hooks/useOrderType";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DISABLED_ITEM_STYLES,
  sidebarNavigation,
  sidebarPagesLink,
} from "../constants";
import { useSidebarActions } from "../hooks/useSidebarActions";

interface SidebarItemProps {
  item: {
    name: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
    isDisabled?: boolean;
    disabledMessage?: string;
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
        item.isDisabled
          ? undefined
          : onClick ||
            (item.route !== "#" ? () => navigate(item.route) : undefined)
      }
      title={item.isDisabled ? item.disabledMessage : item.name}
      key={item.name}
      className={cn(
        isActive
          ? "!bg-primary-red text-white !border-interactive-vivid-red shadow-md shadow-primary-red/60 dark:shadow-primary-red/50"
          : "shadow-md shadow-primary-black/20 dark:shadow-black/70",
        "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium transition-all duration-150",
        item.isDisabled && DISABLED_ITEM_STYLES
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
  const [openStaffList, setOpenStaffList] = useState(false);
  const orderType = useOrderType();
  const storedOrderType = JSON.parse(localStorage.getItem("orderType") || "{}");

  const { handleStaffSelect, handleResetApp } = useSidebarActions(
    setOpenClientDrawer,
    setOpenDropDrawer,
    setOpenStaffList
  );

  return (
    <div className="hidden w-full h-screen md:block z-10">
      <AddClient open={openClientDrawer} setOpen={setOpenClientDrawer} />
      <Drop open={openDropDrawer} setOpen={setOpenDropDrawer} />
      <StaffList
        open={openStaffList}
        setOpen={setOpenStaffList}
        onSelect={handleStaffSelect}
      />
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-between py-3 px-2">
          <div className="flex flex-col gap-y-6">
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
                item={{
                  name:
                    item.name === "Waiters"
                      ? orderType.getWaitersLabel()
                      : item.name,
                  route: item.route,
                  icon: item.icon,
                  isDisabled:
                    item.name === "Clients"
                      ? views !== ORDER_SUMMARY_VIEW
                      : item.name === "Waiters"
                      ? !storedOrderType || orderType.isWaitersDisabled()
                      : item.isDisabled,
                  disabledMessage: item.disabledMessage,
                }}
                pathname={pathname}
                theme={theme}
                onClick={
                  item.name === "Waiters"
                    ? () => setOpenStaffList(true)
                    : item.name === "Drop"
                    ? () => setOpenDropDrawer(true)
                    : item.name === "Clients"
                    ? () => setOpenClientDrawer(true)
                    : () => item.onClick?.(setOpenStaffList)
                }
              />
            ))}
          </div>

          <div className="flex flex-col gap-y-4">
            <Separator
              orientation="horizontal"
              className="!bg-neutral-dark-grey/40 max-w-[60%] mx-auto"
            />
            <Card
              onClick={handleResetApp}
              title="reload"
              key="reload"
              className={cn(
                "w-full p-2 rounded-lg flex flex-col items-center text-xs font-medium transition-all duration-150 text-white",
                "bg-interactive-vivid-red/50 dark:bg-interactive-vivid-red/20 hover:!bg-interactive-vivid-red/60 !border-interactive-dark-red/70"
              )}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="mt-2 text-center">Reload</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
