import Skeleton from "@/components/ui/Skeleton";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";

export default function RootLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero section skeleton */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <Skeleton className="h-7 w-48 rounded-full bg-slate-800" />
            <Skeleton className="mt-7 h-12 w-4/5 rounded-xl bg-slate-800 sm:h-16" />
            <Skeleton className="mt-3 h-12 w-3/5 rounded-xl bg-slate-800 sm:h-16" />
            <Skeleton className="mt-6 h-5 w-full rounded bg-slate-800" />
            <Skeleton className="mt-2 h-5 w-4/5 rounded bg-slate-800" />
            <div className="mt-9 flex gap-4">
              <Skeleton className="h-12 w-44 rounded-xl bg-slate-800" />
              <Skeleton className="h-12 w-44 rounded-xl bg-slate-800" />
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-[2.5rem] bg-slate-900 p-4">
            <Skeleton className="h-full w-full rounded-[2rem] bg-slate-800" />
          </div>
        </div>
      </section>

      {/* Services section skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="mt-3 h-9 w-72 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-96 rounded-md" />
        </div>

        <ServiceGridSkeleton count={6} />
      </section>
    </main>
  );
}
