import { unknownUser } from "@/assets";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { useEffect } from "react";

interface UserCardProps {
  user: User;
  isActive: boolean;
  withRole?: boolean;
  className?: string;
}

export default function UserCard({
  user,
  isActive,
  className,
  withRole = false,
}: UserCardProps) {
  return (
    <div
      className={cn(
        "h-[250px] slide-item w-full !flex !flex-col items-center justify-center",
        className
      )}
    >
      <div
        className={`relative ${
          isActive
            ? "ring-4 ring-red-500 ring-offset-4 ring-offset-gray-100 rounded-full transition-all duration-300"
            : ""
        }`}
      >
        <img
          src={user.image ? user.image : unknownUser}
          alt={user.name}
          className="w-32 h-32 object-cover rounded-full"
        />
      </div>
      <p
        className={`text-zinc-900 font-semibold text-lg mt-4 ${
          isActive ? "text-red-500" : ""
        }`}
      >
        {user.name}
      </p>
      {withRole && (
        <p className="text-zinc-600 font-medium text-sm first-letter:uppercase">
          {user.position}
        </p>
      )}
    </div>
  );
}
