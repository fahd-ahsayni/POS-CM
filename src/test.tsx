import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Teams", href: "#", icon: UserGroupIcon, current: false },
  {
    name: "Directory",
    href: "#",
    icon: MagnifyingGlassCircleIcon,
    current: false,
  },
  { name: "Announcements", href: "#", icon: MegaphoneIcon, current: false },
  { name: "Office Map", href: "#", icon: MapIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
     
    </>
  );
}
