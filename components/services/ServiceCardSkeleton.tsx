import Skeleton from "@/components/ui/Skeleton";

export default function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Image Area Skeleton */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        {/* Category Pill tag placeholder */}
        <div className="absolute top-3.5 left-3.5">
          <Skeleton className="h-6 w-24 rounded-full bg-white/70" />
        </div>
      </div>

      {/* Card Content Area Skeleton */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title line */}
        <Skeleton className="h-6 w-3/4 rounded-md" />

        {/* Description lines */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>

        {/* Highlights lines */}
        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-3/4 rounded" />
          </div>
        </div>

        {/* Footer Actions Skeleton */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
