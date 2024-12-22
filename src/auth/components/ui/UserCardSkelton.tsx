import { Skeleton } from "@/components/ui/skeleton";

const UserCardSkeleton = () => (
  <div className="h-[250px] w-full flex flex-col items-center justify-center">
    <Skeleton className="w-32 h-32 rounded-full bg-primary-black/10" />
    <Skeleton className="w-24 h-4 mt-4 bg-primary-black/10" />
  </div>
);

export default UserCardSkeleton;
