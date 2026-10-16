import Skeleton from "@/components/ui/Skeleton";

export default function BookLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <section className="relative overflow-hidden bg-[#031c43] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="relative mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-12 w-12 rounded-xl" variant="glass" />
          <Skeleton className="h-10 w-64 rounded-2xl sm:h-12" variant="dark" />
          <Skeleton className="h-5 w-full max-w-xl rounded" variant="dark" />
        </div>
      </section>

      {/* Form Card Skeleton */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {/* Step 1: Service selection skeleton */}
          <div className="mb-8 border-b border-slate-100 pb-6 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-6 w-52 rounded-md" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Step 2: Form fields skeleton */}
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>

            {/* Submit button skeleton */}
            <div className="pt-4">
              <Skeleton className="h-13 w-full rounded-xl bg-blue-900/30 sm:w-56" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
