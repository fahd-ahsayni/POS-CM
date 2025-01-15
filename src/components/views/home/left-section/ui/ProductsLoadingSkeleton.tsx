import { Skeleton } from "@/components/ui/skeleton";

export function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
      ))}
    </div>
  );
}