
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";



type BookingDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusStyle(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "IN_PROGRESS":
      return "bg-violet-100 text-violet-800";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function getStatusMessage(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "Your booking has been confirmed. Please contact our team if you need to discuss the arrangements.";
    case "IN_PROGRESS":
      return "Your service is marked as in progress.";
    case "COMPLETED":
      return "This service has been marked as completed. Thank you for choosing SAMB's.";
    case "CANCELLED":
      return "This booking has been cancelled. Please contact our team if you have questions.";
    default:
      return "Your request has been received and is awaiting review. The team will discuss availability, service details, and pricing before confirmation.";
  }
}

export default async function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/account");
  }

  const { id } = await params;

  const booking = await db.booking.findFirst({
    where: {
      id,
      customerId: session.user.id,
    },
    include: {
      service: {
        select: {
          name: true,
          category: true,
          description: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const isLaundry = booking.service.category === "LAUNDRY";

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/account/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to my bookings
          </Link>

          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                  Booking details
                </p>
                <h1 className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-3xl">
                  {booking.service.name}
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  Reference number
                </p>
                <p className="mt-1 break-all font-bold text-slate-800">
                  {booking.bookingNumber}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(booking.status)}`}
              >
                {formatStatus(booking.status)}
              </span>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-blue-700" size={21} />
                <div>
                  <h2 className="font-bold text-slate-900">
                    Current booking status
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {getStatusMessage(booking.status)}
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">
                Requested schedule
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={17} />
                    Preferred date
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatDate(booking.preferredDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={17} />
                    Preferred time
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {booking.preferredTime}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-7">
              <h2 className="text-lg font-bold text-slate-900">
                Service information
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  {isLaundry ? (
                    <Package className="mt-0.5 shrink-0 text-blue-700" size={20} />
                  ) : (
                    <Sparkles className="mt-0.5 shrink-0 text-blue-700" size={20} />
                  )}
                  <div>
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {isLaundry ? "Laundry" : "Cleaning"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-blue-700" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Service address</p>
                    <p className="mt-1 whitespace-pre-wrap font-medium leading-6 text-slate-900">
                      {booking.address}
                    </p>
                  </div>
                </div>

                {booking.propertyType && (
                  <div>
                    <p className="text-sm text-slate-500">Property or venue type</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {booking.propertyType}
                    </p>
                  </div>
                )}

                {booking.numberOfRooms !== null && (
                  <div>
                    <p className="text-sm text-slate-500">Number of rooms</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {booking.numberOfRooms}
                    </p>
                  </div>
                )}

                {booking.estimatedSize && (
                  <div>
                    <p className="text-sm text-slate-500">Estimated size</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {booking.estimatedSize}
                    </p>
                  </div>
                )}

                {booking.specialInstructions && (
                  <div>
                    <p className="text-sm text-slate-500">Special instructions</p>
                    <p className="mt-1 whitespace-pre-wrap leading-7 text-slate-800">
                      {booking.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-7">
              <h2 className="text-lg font-bold text-slate-900">
                Request timeline
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Request submitted
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>

                {booking.confirmedAt && (
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Booking confirmed
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(booking.confirmedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {booking.completedAt && (
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Service completed
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(booking.completedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {booking.cancelledAt && (
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Booking cancelled
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(booking.cancelledAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5">
              <h2 className="font-bold text-blue-950">
                Pricing and confirmation
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                Your service price is discussed based on the scope of work.
                The preferred date and time are requests and are not confirmed
                until the team approves the booking.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Browse services
              </Link>
              <Link
                href="/account/bookings"
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                All my bookings
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
