import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation, sidebarPagesLink } from "../constants";
import { useTheme } from "@/providers/themeProvider";

interface SidebarItemProps {
  item: {
    name: string;
    route: string;
    icon: React.ComponentType<{ className: string }>;
  };
  pathname: string;
  theme: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, pathname, theme }) => (
  <Link to={item.route} key={item.name}>
    <Card
      className={cn(
        pathname === item.route
          ? "!bg-primary-red text-white !border-interactive-vivid-red"
          : "",
        "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5",
          pathname === item.route
            ? "fill-white"
            : theme === "dark"
            ? "fill-white"
            : "fill-black"
        )}
      />
      <span className="mt-2 text-center">{item.name}</span>
    </Card>
  </Link>
);

export default function Sidebar() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  return (
    <div className="hidden w-ful h-screen overflow-y-auto md:block z-10">
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-evenly px-2">
          {sidebarPagesLink.map((item) => (
            <SidebarItem item={item} pathname={pathname} theme={theme} />
          ))}
          {sidebarNavigation.map((item) => (
            <SidebarItem item={item} pathname={pathname} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
