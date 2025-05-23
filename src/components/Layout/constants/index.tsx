import { openCashDrawer } from "@/api/services";

import {
  AddClientIcon,
  DropIcon,
  HomeIcon,
  OpenDrawerIcon,
  OrdersIcon,
  WaitersIcon,
  WaitingOrdersIcon,
} from "@/assets/plumpy-icons";
import { createToast } from "@/components/global/Toasters";
import { toast } from "react-toastify";

// Add new interface for sidebar items
interface SidebarItem {
  name: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: (() => void) | ((setOpen: (open: boolean) => void) => void);
  isDisabled?: boolean;
  disabledMessage?: string;
}

// Add disabled styles constant
export const DISABLED_ITEM_STYLES = "opacity-50 cursor-not-allowed shadow-none";

// Update handleOpenCashDrawer with disabled check
const handleOpenCashDrawer = async () => {
  const shiftId = localStorage.getItem("shiftId");
  if (!shiftId) {
    console.error("No shift ID found");
    return;
  }

  try {
    await openCashDrawer(shiftId);
    toast.success(
      createToast("Cash Drawer", "Cash drawer opened successfully", "success")
    );
  } catch (error) {
    console.error("Failed to open cash drawer:", error);
  }
};

// Update sidebarNavigation with disabled states
export const sidebarNavigation: SidebarItem[] = [
  {
    name: "Drawer",
    route: "#",
    icon: OpenDrawerIcon,
    onClick: handleOpenCashDrawer,
  },
  {
    name: "Clients",
    route: "#",
    icon: AddClientIcon,
    onClick: () => console.log("Add client clicked"),
    isDisabled: false,
  },
  {
    name: "Waiters",
    route: "#",
    icon: WaitersIcon,
    onClick: () => {},
    isDisabled: false,
    disabledMessage: "Please select an order type first",
  },
  {
    name: "Drop",
    route: "#",
    icon: DropIcon,
    onClick: () => console.log("Drop clicked"),
  },
  // {
  //   name: "Prefers",
  //   route: "#",
  //   icon: PreferencesIcon,
  //   onClick: () => console.log("Preferences clicked"),
  //   current: false,
  // },
];

// Update sidebarPagesLink with proper typing
export const sidebarPagesLink: SidebarItem[] = [
  {
    name: "Home",
    route: "/",
    icon: HomeIcon,
    onClick: () => console.log("Home clicked"),
  },
  {
    name: "Orders",
    route: "/orders",
    icon: OrdersIcon,
    onClick: () => console.log("Orders clicked"),
  },
  {
    name: "Waiting",
    route: "/waiting-orders",
    icon: WaitingOrdersIcon,
    onClick: () => console.log("Waiting clicked"),
  },
];
