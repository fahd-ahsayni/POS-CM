import {
  addClient,
  preferences,
  home,
  orders,
  waitingOrders,
  openDrawer,
  waiters,
  drop,
} from "@/assets";

export const sidebarNavigation = [
  { name: "Home", href: "/", icon: home, current: false },
  { name: "Orders", href: "/orders", icon: orders, current: false },
  { name: "Waiting orders", href: "#", icon: waitingOrders, current: true },
  { name: "Open Drawer  ", href: "#", icon: openDrawer, current: false },
  { name: "Add client", href: "#", icon: addClient, current: false },
  { name: "Waiters", href: "#", icon: waiters, current: false },
  { name: "Drop", href: "#", icon: drop, current: false },
  { name: "Prefers", href: "#", icon: preferences, current: false },
];
