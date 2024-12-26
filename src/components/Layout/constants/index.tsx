import { openCashDrawer } from "@/api/services";

import {
  HomeIcon,
  OrdersIcon,
  OpenDrawerIcon,
  AddClientIcon,
  WaitersIcon,
  DropIcon,
  PreferencesIcon,
  WaitingOrdersIcon,
} from "@/assets/sidebar";

const handleOpenCashDrawer = async () => {
  try {
    const shiftId = localStorage.getItem("shiftId");
    if (!shiftId) {
      console.error("No shift ID found");
      return;
    }
    await openCashDrawer(shiftId);
  } catch (error) {
    console.error("Failed to open cash drawer:", error);
  }
};

export const sidebarPagesLink = [
  {
    name: "Home",
    route: "/",
    icon: HomeIcon,
  },
  {
    name: "Orders",
    route: "/orders",
    icon: OrdersIcon,
  },
  {
    name: "Waiting orders",
    route: "/waiting-orders",
    icon: WaitingOrdersIcon,
  },
];

export const sidebarNavigation = [
  {
    name: "Open Drawer",
    route: "#",
    icon: OpenDrawerIcon,
    onClick: handleOpenCashDrawer,
    current: false,
  },
  {
    name: "Add client",
    route: "#",
    icon: AddClientIcon,
    onClick: () => console.log("Add client clicked"),
    current: false,
  },
  {
    name: "Waiters",
    route: "#",
    icon: WaitersIcon,
    onClick: () => console.log("Waiters clicked"),
    current: false,
  },
  {
    name: "Drop",
    route: "#",
    icon: DropIcon,
    onClick: () => console.log("Drop clicked"),
    current: false,
  },
  {
    name: "Prefers",
    route: "#",
    icon: PreferencesIcon,
    onClick: () => console.log("Preferences clicked"),
    current: false,
  },
];
