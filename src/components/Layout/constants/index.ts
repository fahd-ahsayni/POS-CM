import {
  CogIcon,
  HomeIcon,
  PhotoIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const sidebarNavigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: false },
  { name: "Orders", href: "#", icon: Squares2X2Icon, current: false },
  { name: "Waiting orders", href: "#", icon: PhotoIcon, current: true },
  { name: "Open Drawer  ", href: "#", icon: UserGroupIcon, current: false },
  { name: "Add client", href: "#", icon: RectangleStackIcon, current: false },
  { name: "Waiters", href: "#", icon: CogIcon, current: false },
  { name: "Drop", href: "#", icon: CogIcon, current: false },
  { name: "Prefers", href: "#", icon: CogIcon, current: false },
];
