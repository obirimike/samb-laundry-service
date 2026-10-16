import Skeleton from "@/components/ui/Skeleton";

export default function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      {/* Image Area Skeleton */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Category Pill Tag Placeholder */}
        <div className="absolute top-3.5 left-3.5">
          <Skeleton className="h-6 w-28 rounded-full bg-white/90 shadow-sm" />
        </div>

        {/* Title Overlay on bottom of image */}
        <div className="absolute right-4 bottom-3 left-4">
          <Skeleton className="h-6 w-3/4 rounded-md" variant="glass" />
        </div>
      </div>

      {/* Card Content Area Skeleton */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Description lines matching min-h-[48px] */}
        <div className="min-h-[48px] space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Highlights lines */}
        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-full" />
              <Skeleton
                className={`h-3.5 rounded ${
                  i === 0 ? "w-4/5" : i === 1 ? "w-2/3" : "w-3/4"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons matching Details + Book dual buttons */}
        <div className="mt-6 flex items-center gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
