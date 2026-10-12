import Skeleton from "@/components/ui/Skeleton";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";

export default function ServicesLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header Skeleton */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-36 rounded-full bg-slate-800" />
          <Skeleton className="mt-4 h-12 w-2/3 rounded-xl bg-slate-800 sm:h-14" />
          <Skeleton className="mt-4 h-5 w-1/2 rounded bg-slate-800" />
        </div>
      </section>

      {/* Grid and Tabs Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filter Tabs Skeleton */}
        <div className="mb-8 flex gap-3 border-b border-slate-200/80 pb-4">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>

        {/* 6 Cards Grid Skeleton */}
        <ServiceGridSkeleton count={6} />
      </section>
    </main>
  );
}
