import Skeleton from "@/components/ui/Skeleton";

export default function CustomerQuotesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-7">
      {/* Account Quotes Header Skeleton */}
      <header className="rounded-2xl bg-gradient-to-r from-blue-800 to-indigo-700 p-6 text-white sm:p-8 space-y-3">
        <Skeleton className="h-4 w-28 rounded" variant="glass" />
        <Skeleton className="h-8 w-60 rounded-xl" variant="glass" />
        <Skeleton className="h-4 w-full max-w-lg rounded" variant="glass" />
        <div className="pt-2">
          <Skeleton className="h-8 w-48 rounded-full" variant="glass" />
        </div>
      </header>

      {/* Quote Cards Skeleton */}
      <div className="space-y-5">
        {[0, 1].map((i) => (
          <article
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-6 w-56 rounded-md" />
                <Skeleton className="h-3.5 w-40 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>

              {/* Table skeleton */}
              <div className="overflow-hidden rounded-xl border border-slate-200 p-4 space-y-3">
                <Skeleton className="h-5 w-36 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-36 rounded-xl bg-blue-900/30" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
