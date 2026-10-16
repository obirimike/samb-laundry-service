import Skeleton from "@/components/ui/Skeleton";

export default function ServiceDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <Skeleton className="h-5 w-28 rounded" variant="glass" />

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl flex-1 space-y-4">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-xl" variant="glass" />
                <Skeleton className="h-4 w-32 rounded" variant="dark" />
              </div>

              {/* Title */}
              <Skeleton className="h-10 w-3/4 rounded-2xl sm:h-14" variant="dark" />

              {/* Subtitle */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded" variant="dark" />
                <Skeleton className="h-4 w-4/5 rounded" variant="dark" />
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Skeleton className="h-12 w-44 rounded-xl" variant="glass" />
                <Skeleton className="h-12 w-36 rounded-xl" variant="dark" />
              </div>
            </div>

            {/* Image Placeholder Skeleton */}
            <div className="aspect-[16/10] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-2 lg:w-[480px]">
              <Skeleton className="h-full w-full rounded-2xl" variant="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Details and Sidebar Skeleton */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main Card */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
            <Skeleton className="h-7 w-56 rounded-lg" />
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="pt-4">
              <Skeleton className="h-6 w-48 rounded-md" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="mt-4 h-12 w-full rounded-xl bg-blue-900/20" />
          </div>
        </div>
      </section>
    </main>
  );
}
