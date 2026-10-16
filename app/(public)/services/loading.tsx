import Skeleton from "@/components/ui/Skeleton";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";

export default function ServicesLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header Skeleton */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 bg-[#031c43]" />
        <div className="relative mx-auto max-w-7xl space-y-4">
          <Skeleton className="h-7 w-48 rounded-full" variant="glass" />
          <Skeleton className="h-12 w-80 rounded-2xl sm:h-14" variant="dark" />
          <Skeleton className="h-5 w-full max-w-xl rounded" variant="dark" />
        </div>
      </section>

      {/* Grid and Tabs Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filter Tabs Skeleton */}
        <div className="mb-8 flex flex-wrap gap-2.5 border-b border-slate-200/80 pb-5">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* 6 Cards Grid Skeleton */}
        <ServiceGridSkeleton count={6} />

        {/* Help Box Skeleton */}
        <div className="mt-16 rounded-3xl bg-[#031c43] p-8 text-white sm:p-10">
          <div className="max-w-2xl space-y-3">
            <Skeleton className="h-8 w-80 rounded-lg sm:w-96" variant="dark" />
            <Skeleton className="h-4 w-full rounded" variant="dark" />
            <Skeleton className="h-4 w-3/4 rounded" variant="dark" />
            <div className="pt-2">
              <Skeleton className="h-11 w-44 rounded-xl" variant="glass" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
