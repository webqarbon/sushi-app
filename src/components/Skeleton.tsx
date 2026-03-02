import { cn } from "../utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200/60",
        className
      )}
    />
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col bg-white rounded-[2.5rem] p-4 border border-gray-100/50 shadow-sm space-y-4">
          <Skeleton className="aspect-square rounded-[2.2rem] w-full" />
          <div className="space-y-2 flex flex-col items-center">
             <Skeleton className="h-2 w-24 rounded-full" />
             <Skeleton className="h-6 w-3/4 rounded-full" />
             <Skeleton className="h-4 w-full rounded-full" />
             <Skeleton className="h-4 w-2/3 rounded-full" />
          </div>
          <div className="mt-auto flex items-center justify-between p-2">
             <Skeleton className="h-8 w-20 rounded-xl" />
             <Skeleton className="h-14 w-14 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
