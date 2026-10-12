import Skeleton from "@/components/ui/Skeleton";

export default function BookLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-12 w-12 rounded-xl bg-slate-800" />
          <Skeleton className="mt-5 h-10 w-64 rounded-xl bg-slate-800" />
          <Skeleton className="mt-4 h-5 w-full max-w-2xl rounded bg-slate-800" />
        </div>
      </section>

      {/* Form Card Skeleton */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="mt-2 h-6 w-48 rounded" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
