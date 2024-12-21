import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation, sidebarPagesLink } from "../constants";

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="hidden w-ful h-screen overflow-y-auto md:block z-10">
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-evenly px-2">
          {sidebarPagesLink.map((item) => (
            <Link to={item.route} key={item.name}>
              <Card
                className={cn(
                  pathname === item.route
                    ? "bg-primary-red text-white border-interactive-vivid-red"
                    : "",
                  "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
                )}
              >
                <img src={item.icon} alt={item.name} className="w-5 h-5" />
                <span className="mt-2 text-center">{item.name}</span>
              </Card>
            </Link>
          ))}
          {sidebarNavigation.map((item) => (
            <Card
              key={item.name}
              onClick={() => item.onClick()}
              className={cn(
                pathname === item.route
                  ? "bg-red-600 text-white"
                  : "",
                "group cursor-pointer w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
              )}
            >
              <img src={item.icon} alt={item.name} className="w-5 h-5" />
              <span className="mt-2 text-center">{item.name}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
