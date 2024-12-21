import { openCashDrawer } from "@/api/services";
import {
  addClient,
  drop,
  home,
  openDrawer,
  orders,
  preferences,
  waiters,
  waitingOrders,
} from "@/assets";

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
    icon: home,
  },
  {
    name: "Orders",
    route: "/orders",
    icon: orders,
  },
];

export const sidebarNavigation = [
  {
    name: "Waiting orders",
    route: "#",
    icon: waitingOrders,
    onClick: () => console.log("Waiting orders clicked"),
    current: true,
  },
  {
    name: "Open Drawer",
    route: "#",
    icon: openDrawer,
    onClick: handleOpenCashDrawer,
    current: false,
  },
  {
    name: "Add client",
    route: "#",
    icon: addClient,
    onClick: () => console.log("Add client clicked"),
    current: false,
  },
  {
    name: "Waiters",
    route: "#",
    icon: waiters,
    onClick: () => console.log("Waiters clicked"),
    current: false,
  },
  {
    name: "Drop",
    route: "#",
    icon: drop,
    onClick: () => console.log("Drop clicked"),
    current: false,
  },
  {
    name: "Prefers",
    route: "#",
    icon: preferences,
    onClick: () => console.log("Preferences clicked"),
    current: false,
  },
];
