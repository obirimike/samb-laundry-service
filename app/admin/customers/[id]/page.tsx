
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

type CustomerDetailProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function AdminCustomerDetailPage({
  params,
}: CustomerDetailProps) {
  const session = await auth();

  if (!session?.user) redirect("/login?callbackUrl=%2Fadmin%2Fcustomers");
  if (session.user.role !== "ADMIN") redirect("/account");

  const { id } = await params;

  const customer = await db.user.findFirst({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      bookings: {
        select: {
          id: true,
          bookingNumber: true,
          status: true,
          preferredDate: true,
          preferredTime: true,
          createdAt: true,
          service: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!customer) notFound();

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={17} /> Back to customers
          </Link>

          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UserRound size={28} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-blue-700">
                  Customer profile
                </p>
                <h1 className="mt-1 break-words text-2xl font-extrabold text-slate-900">
                  {customer.name}
                </h1>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </p>
                <p className="mt-2 break-all text-slate-900">
                  {customer.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </p>
                <p className="mt-2 text-slate-900">
                  {customer.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer since
                </p>
                <p className="mt-2 text-slate-900">
                  {formatDate(customer.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total bookings
                </p>
                <p className="mt-2 text-slate-900">
                  {customer.bookings.length}
                  {customer.bookings.length === 100 ? " (latest 100)" : ""}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <CalendarDays size={22} className="text-blue-700" />
                <h2 className="text-xl font-bold text-slate-900">
                  Booking history
                </h2>
              </div>
            </div>

            {customer.bookings.length === 0 ? (
              <p className="p-8 text-sm text-slate-500">
                This customer has not submitted any bookings yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {customer.bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="flex flex-col justify-between gap-3 p-5 hover:bg-slate-50 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="break-all font-bold text-slate-900">
                        {booking.bookingNumber}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.service.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Preferred: {formatDate(booking.preferredDate)} ·{" "}
                        {booking.preferredTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                        {booking.status.replaceAll("_", " ")}
                      </span>
                      <ArrowRight size={17} className="text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
