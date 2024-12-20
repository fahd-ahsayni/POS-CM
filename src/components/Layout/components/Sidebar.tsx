import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarNavigation } from "../constants";
import { Card } from "@/components/ui/card";

export default function Sidebar() {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  return (
    <div className="hidden w-20 h-screen overflow-y-auto md:block z-10">
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-evenly px-2">
          {sidebarNavigation.map((item) => (
            <Card
              key={item.name}
              onClick={() => navigate(item.href)}
              className={cn(
                pathname === item.href
                  ? "bg-red-600 text-white"
                  : "text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white",
                "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
              )}
              aria-current={pathname === item.href ? "page" : undefined}
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
