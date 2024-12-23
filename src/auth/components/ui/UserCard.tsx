import { unknownUser } from "@/assets";
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface UserCardProps {
  user: User;
  isActive?: boolean;
  withRole?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function UserCard({
  user,
  isActive = true,
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
            ? "ring-[6px] ring-red-500 ring-offset-[8px] ring-offset-secondary-white rounded-full transition-all duration-300"
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
