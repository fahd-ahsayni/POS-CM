import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarNavigation, sidebarPagesLink } from "../constants";
import { useTheme } from "@/providers/themeProvider";

interface SidebarItemProps {
  item: {
    name: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  pathname: string;
  theme: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pathname,
  theme,
  onClick,
}) => {
  const navigate = useNavigate();
  const isActive = pathname === item.route;

  return (
    <Card
      onClick={pathname ? () => navigate(item.route) : onClick}
      key={item.name}
      className={cn(
        isActive
          ? "!bg-primary-red text-white !border-interactive-vivid-red"
          : "",
        "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
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
  const { theme } = useTheme();
  const { pathname } = useLocation();

  return (
    <div className="hidden w-ful h-screen overflow-y-auto md:block z-10">
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-around px-2">
          {/* Pages Links */}
          <SidebarItem
            item={sidebarPagesLink[0]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarPagesLink[1]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarPagesLink[2]}
            pathname={pathname}
            theme={theme}
          />

          {/* Navigation Items */}
          <SidebarItem
            item={sidebarNavigation[0]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarNavigation[1]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarNavigation[2]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarNavigation[3]}
            pathname={pathname}
            theme={theme}
          />
          <SidebarItem
            item={sidebarNavigation[4]}
            pathname={pathname}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
