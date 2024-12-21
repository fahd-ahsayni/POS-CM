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
import axios from "axios";

const handleOpenCashDrawer = async () => {
  const shiftId = localStorage.getItem("shiftId");

  await axios.post(
    `${import.meta.env.VITE_BASE_URL}/pos/open-cashdrawer`,
    {
      shift_id: shiftId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
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
