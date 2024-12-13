import { cn } from "@/lib/utils";
import { sidebarNavigation } from "../constants";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="hidden w-24 h-screen overflow-y-auto md:block">
      <div className="flex w-full flex-col h-full items-center">
        <div className="w-full flex-1 flex flex-col justify-evenly px-2">
          {sidebarNavigation.map((item) => (
            <Card
              key={item.name}
              onClick={() => navigate(item.href)}
              className={cn(
                item.current
                  ? "bg-red-600 text-white"
                  : "text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white",
                "group w-full p-2 rounded-md flex flex-col items-center text-xs font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  item.current
                    ? "text-white"
                    : "text-zinc-50 group-hover:text-white",
                  "h-5 w-5"
                )}
                aria-hidden="true"
              />
              <span className="mt-2 text-center">{item.name}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
