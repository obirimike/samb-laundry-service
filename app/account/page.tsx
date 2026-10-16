
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SignOutButton from "@/components/auth/SignOutButton";

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-5 py-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-slate-900">
            <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-blue-200 bg-blue-900 shadow-sm">
              <Image
                src="/images/logo/samb-logo.jpeg"
                alt="SAMB's Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <span>SAMB&apos;s Services</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/account/notifications"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#031c43] px-4 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Notifications
            </Link>
           <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section className="rounded-3xl bg-[#031c43] p-8 text-white sm:p-10">
          <p className="text-sm font-medium text-blue-100">CUSTOMER DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome, {firstName}!
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-blue-100">
            Request a cleaning or laundry service and keep track of your bookings
            from one convenient place.
          </p>

          
<Link
  href="/book"
  className="mt-5 inline-block rounded-xl border border-blue-200 px-5 py-3 font-semibold bg-white text-blue-700 hover:bg-slate-100"
>
  Request a service
</Link>


<Link
  href="/account/bookings"
  className="mt-5 ml-5 inline-block rounded-xl border border-blue-200 px-5 py-3 font-semibold bg-blue text-white hover:bg-gray-800"
>
  My bookings
</Link>

<Link
  href="/account/quotes"
  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
>
  <h2 className="font-bold text-slate-900 group-hover:text-blue-700">
    My quotations
  </h2>
  <p className="mt-2 text-sm leading-6 text-slate-600">
    Review service prices, check quotation terms, and respond to quotes.
  </p>
  <span className="mt-3 inline-block text-sm font-semibold text-blue-700">
    View quotations →
  </span>
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
