import Skeleton from "@/components/ui/Skeleton";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header Skeleton matching real NavBar height and layout */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo & Brand Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full border border-blue-100" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </div>

          {/* Desktop Nav Links Skeleton */}
          <div className="hidden items-center gap-7 md:flex">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          {/* Nav Action Buttons Skeleton */}
          <div className="hidden items-center gap-3 sm:flex">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl bg-blue-900/30" />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section Skeleton matching brand colors & proportions */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[#031c43]" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#031c43]/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#031c43]/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
            <div>
              {/* Badge */}
              <Skeleton
                className="h-8 w-56 rounded-full"
                variant="glass"
              />

              {/* Headline */}
              <div className="mt-7 space-y-3">
                <Skeleton
                  className="h-11 w-4/5 rounded-2xl sm:h-14 lg:h-16"
                  variant="dark"
                />
                <Skeleton
                  className="h-11 w-3/5 rounded-2xl sm:h-14 lg:h-16"
                  variant="dark"
                />
              </div>

              {/* Subheading text */}
              <div className="mt-6 space-y-2.5">
                <Skeleton className="h-4 w-full rounded" variant="dark" />
                <Skeleton className="h-4 w-11/12 rounded" variant="dark" />
                <Skeleton className="h-4 w-2/3 rounded" variant="dark" />
              </div>

              {/* Dual CTA Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Skeleton
                  className="h-12 w-full rounded-xl sm:w-44"
                  variant="glass"
                />
                <Skeleton
                  className="h-12 w-full rounded-xl sm:w-44"
                  variant="dark"
                />
              </div>

              {/* Trust points */}
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                <Skeleton className="h-5 w-48 rounded-full" variant="dark" />
                <Skeleton className="h-5 w-40 rounded-full" variant="dark" />
              </div>
            </div>

            {/* Right Column: Hero Card Skeleton with Floating Badges */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:p-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-slate-900 sm:aspect-[16/12] lg:aspect-[4/3]">
                  <Skeleton className="h-full w-full rounded-[2rem]" variant="blue" />
                </div>
              </div>

              {/* Floating Quality Badge (bottom-left) */}
              <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:flex">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-emerald-100" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>

              {/* Floating Service Pill (top-right) */}
              <div className="absolute -top-4 -right-3 hidden items-center gap-2.5 rounded-2xl border border-white/20 bg-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur-md md:flex">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" variant="glass" />
                <Skeleton className="h-4 w-36 rounded" variant="dark" />
              </div>
            </div>
          </div>
        </section>

        {/* Highlight/Trust Bar Skeleton */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded font-semibold" />
                  <Skeleton className="h-3.5 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section Skeleton */}
        <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="mt-3 h-9 w-72 rounded-lg sm:h-10" />
                <Skeleton className="mt-3 h-4 w-96 max-w-full rounded" />
              </div>
              <Skeleton className="h-5 w-36 rounded" />
            </div>

            <div className="mt-10">
              <ServiceGridSkeleton count={6} />
            </div>
          </div>
        </section>

        {/* About Section Skeleton */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 sm:p-12 space-y-4">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-8 w-4/5 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="space-y-6">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-9 w-72 rounded-lg" />
              <div className="mt-6 space-y-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-44 rounded" />
                      <Skeleton className="h-3.5 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner Skeleton */}
        <section className="bg-[#031c43] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="space-y-3">
              <Skeleton className="h-8 w-80 rounded-lg sm:w-96" variant="dark" />
              <Skeleton className="h-4 w-full max-w-xl rounded" variant="dark" />
            </div>
            <Skeleton className="h-12 w-36 shrink-0 rounded-xl" variant="glass" />
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" variant="dark" />
              <Skeleton className="h-4 w-32 rounded" variant="dark" />
            </div>
            <Skeleton className="h-3.5 w-full rounded" variant="dark" />
            <Skeleton className="h-3.5 w-3/4 rounded" variant="dark" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-20 rounded" variant="dark" />
            <Skeleton className="h-3.5 w-24 rounded" variant="dark" />
            <Skeleton className="h-3.5 w-28 rounded" variant="dark" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-36 rounded" variant="dark" />
            <Skeleton className="h-3.5 w-32 rounded" variant="dark" />
            <Skeleton className="h-3.5 w-24 rounded" variant="dark" />
          </div>
        </div>
      </footer>
    </div>
  );
}
