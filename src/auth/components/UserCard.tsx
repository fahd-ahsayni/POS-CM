import { cn } from "@/lib/utils";

interface UserCardProps {
  user: {
    id: number;
    name: string;
    imageUrl: string;
  };
  isActive: boolean;
  role?: string;
  className?: string;
}

export default function UserCard({
  role,
  user,
  isActive,
  className,
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
            ? "ring-4 ring-red-500 ring-offset-4 rounded-full transition-all duration-300"
            : ""
        }`}
      >
        <img
          src={user.imageUrl}
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
      {role && <p className="text-zinc-500 text-sm font-medium">{role}</p>}
    </div>
  );
}
