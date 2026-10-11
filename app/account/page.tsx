
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const bookings = await db.booking.findMany({
    where: {
      customerId: session.user.id,
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const firstName = session.user.name?.split(" ")[0] || "Customer";

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-lg font-bold text-indigo-800">
            SAMB&apos;s Services
          </Link>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white sm:p-10">
          <p className="text-sm font-medium text-blue-100">CUSTOMER DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome, {firstName}!
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-blue-100">
            Request a cleaning or laundry service and keep track of your bookings
            from one convenient place.
          </p>

          <Link
            href="/account/bookings/new"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-indigo-800 transition hover:bg-blue-50"
          >
            Request a service
          </Link>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent bookings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your five most recent service requests.
              </p>
            </div>

            <Link
              href="/account/bookings"
              className="text-sm font-semibold text-indigo-700 hover:underline"
            >
              View all
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                ✨
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No bookings yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When you request a service, your booking and its status will
                appear here.
              </p>
              <Link
                href="/account/bookings/new"
                className="mt-5 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800"
              >
                Make your first request
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.service.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Booking #{booking.bookingNumber}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Preferred date:{" "}
                        {booking.preferredDate.toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[booking.status] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {booking.status.replaceAll("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
