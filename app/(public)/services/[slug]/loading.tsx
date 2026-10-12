import Skeleton from "@/components/ui/Skeleton";

export default function ServiceDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-5 w-28 rounded bg-slate-800" />

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl flex-1">
              <Skeleton className="h-6 w-32 rounded-full bg-slate-800" />
              <Skeleton className="mt-4 h-12 w-3/4 rounded-xl bg-slate-800" />
              <Skeleton className="mt-4 h-5 w-full rounded bg-slate-800" />
              <Skeleton className="mt-2 h-5 w-4/5 rounded bg-slate-800" />

              <div className="mt-8 flex gap-4">
                <Skeleton className="h-12 w-44 rounded-xl bg-slate-800" />
                <Skeleton className="h-12 w-36 rounded-xl bg-slate-800" />
              </div>
            </div>

            {/* Image Placeholder Skeleton */}
            <div className="aspect-[16/10] w-full max-w-lg rounded-3xl bg-slate-900 lg:w-[480px]">
              <Skeleton className="h-full w-full rounded-3xl bg-slate-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Details and Sidebar Skeleton */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <Skeleton className="mt-8 h-6 w-48 rounded" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="mt-6 h-14 rounded-xl" />
            <Skeleton className="mt-4 h-14 rounded-xl" />
            <Skeleton className="mt-4 h-14 rounded-xl" />
            <Skeleton className="mt-6 h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
