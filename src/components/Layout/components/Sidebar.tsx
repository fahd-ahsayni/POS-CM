import { cn } from "@/lib/utils";
import { sidebarNavigation } from "../constants";

export default function Sidebar() {
  return (
    <div className="hidden w-28 overflow-y-auto md:block">
      <div className="flex w-full flex-col items-center py-3">
        <div className="w-full flex-1 space-y-4 px-2">
          {sidebarNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                item.current
                  ? "bg-red-600 text-white"
                  : "text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white",
                "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  item.current
                    ? "text-white"
                    : "text-zinc-50 group-hover:text-white",
                  "h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="mt-2">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
