import { CatalogSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-12 pb-32 pt-12">
      {/* 1. Category Nav Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-hidden mb-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="min-w-[120px] h-[120px] rounded-[2.5rem] shrink-0" />
          ))}
        </div>
      </div>

      {/* 2. Hero Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="w-full h-[480px] rounded-[2.5rem]" />
      </div>

      {/* 3. Catalog Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-10 rounded-full" />
        <CatalogSkeleton />
      </div>
    </div>
  );
}
