import Skeleton from "@/components/ui/Skeleton";

export default function AdminQuotesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl bg-blue-900/30" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          >
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3.5 w-44 rounded" />
            </div>
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </main>
  );
}
