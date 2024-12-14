import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, HelpCircle, LogOut, Power, User } from "lucide-react";

const menuItems = [
  { icon: User, label: "My Profile" },
  { icon: HelpCircle, label: "Help" },
  { icon: Power, label: "End Shift" },
  { icon: LogOut, label: "Logout" },
];

export default function Profile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <div>
            <img
              className="inline-block h-9 w-9 rounded-lg"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div className="ml-3 flex flex-col justify-center items-start h-10">
            <p className="text-sm/4 font-medium">Fahd AHSAYNI</p>
            <p className="text-xs font-medium text-zinc-300">View profile</p>
          </div>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="ms-2 opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            Terrace POS 1
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            Shift: 3h ago
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.slice(0, 2).map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.icon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.slice(2, 3).map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.icon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="!text-red-600">
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
