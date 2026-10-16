"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";

type Booking = {
  id: string;
  bookingNumber: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  address: string;
  customer: { name: string | null; email: string | null };
  service: { name: string; category: string };
};

type ViewMode = "month" | "week" | "day";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) return value;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) return value;

  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingCalendar({
  bookings,
}: {
  bookings: Booking[];
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filteredBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (statusFilter === "ALL" || booking.status === statusFilter) &&
          (categoryFilter === "ALL" ||
            booking.service.category === categoryFilter),
      ),
    [bookings, statusFilter, categoryFilter],
  );

  const visibleDates = useMemo(() => {
    if (view === "day") return [new Date(currentDate)];

    if (view === "week") {
      const first = startOfWeek(currentDate);

      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(first);
        date.setDate(first.getDate() + index);
        return date;
      });
    }

    const first = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const last = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const dates: Date[] = [];

    for (let i = 0; i < first.getDay(); i++) {
      dates.push(new Date(first.getFullYear(), first.getMonth(), i - first.getDay() + 1));
    }

    for (let day = 1; day <= last.getDate(); day++) {
      dates.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      );
    }

    while (dates.length % 7 !== 0) {
      const next = new Date(dates[dates.length - 1]);
      next.setDate(next.getDate() + 1);
      dates.push(next);
    }

    return dates;
  }, [currentDate, view]);

  const bookingsByDate = useMemo(() => {
    const groups = new Map<string, Booking[]>();

    for (const booking of filteredBookings) {
      const key = dateKey(parseLocalDate(booking.preferredDate));
      const existing = groups.get(key) ?? [];
      existing.push(booking);
      groups.set(key, existing);
    }

    for (const dayBookings of groups.values()) {
      dayBookings.sort((a, b) =>
        a.preferredTime.localeCompare(b.preferredTime),
      );
    }

    return groups;
  }, [filteredBookings]);

  function moveDate(direction: number) {
    setCurrentDate((previous) => {
      const next = new Date(previous);

      if (view === "month") {
        next.setDate(1);
        next.setMonth(next.getMonth() + direction);
      } else if (view === "week") {
        next.setDate(next.getDate() + direction * 7);
      } else {
        next.setDate(next.getDate() + direction);
      }

      return next;
    });
  }

  const heading =
    view === "month"
      ? currentDate.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })
      : view === "day"
        ? currentDate.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : `${visibleDates[0].toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
          })} – ${visibleDates[6].toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Booking schedule
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredBookings.length} booking
              {filteredBookings.length === 1 ? "" : "s"} across all dates
              loaded
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 text-black"
            >
              Today
            </button>

            <div className="flex rounded-lg border border-slate-200 p-1">
              {(["month", "week", "day"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  aria-pressed={view === item}
                  className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${
                    view === item
                      ? "bg-[#031c43] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => moveDate(-1)}
              aria-label="Previous period"
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
            >
              <ChevronLeft size={19} />
            </button>

            <h3 className="min-w-0 text-lg font-bold text-slate-900">
              {heading}
            </h3>

            <button
              type="button"
              onClick={() => moveDate(1)}
              aria-label="Next period"
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Filter by booking status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-black"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              aria-label="Filter by service category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-black"
            >
              <option value="ALL">All services</option>
              <option value="CLEANING">Cleaning</option>
              <option value="LAUNDRY">Laundry</option>
              <option value="DOMESTIC SUPPORT">Domestic Support</option>
              <option value="PEST CONTROL">Pest Control</option>
            </select>
          </div>
        </div>

        {view === "month" && (
          <div className="mt-6 grid grid-cols-7 border-l border-t border-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="border-b border-r border-slate-200 bg-slate-50 py-3 text-center text-xs font-bold text-slate-600 sm:text-sm"
                >
                  {day}
                </div>
              ),
            )}

            {visibleDates.map((date) => {
              const key = dateKey(date);
              const dayBookings = bookingsByDate.get(key) ?? [];
              const isCurrentMonth =
                date.getMonth() === currentDate.getMonth();
              const isToday = key === dateKey(new Date());

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setCurrentDate(date);
                    setView("day");
                  }}
                  className={`min-h-24 overflow-hidden border-b border-r border-slate-200 p-1.5 text-left transition hover:bg-blue-50 sm:min-h-32 sm:p-2 ${
                    isCurrentMonth ? "bg-white" : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-[#031c43] text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <span
                        key={booking.id}
                        className={`block truncate rounded px-1.5 py-1 text-[10px] font-semibold sm:text-xs ${
                          statusStyles[booking.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                        title={`${booking.preferredTime} · ${booking.service.name}`}
                      >
                        {booking.preferredTime} {booking.service.name}
                      </span>
                    ))}

                    {dayBookings.length > 2 && (
                      <span className="block px-1 text-[10px] font-semibold text-slate-500">
                        +{dayBookings.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {view !== "month" && (
          <div className="mt-6 space-y-4">
            {visibleDates.map((date) => {
              const key = dateKey(date);
              const dayBookings = bookingsByDate.get(key) ?? [];

              return (
                <section key={key} className="rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h4 className="font-semibold text-slate-800">
                      {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {dayBookings.length} booking
                      {dayBookings.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {dayBookings.length === 0 ? (
                    <p className="px-4 py-5 text-sm text-slate-500">
                      No bookings scheduled for this date.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {dayBookings.map((booking) => (
                        <article key={booking.id} className="p-4">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900">
                                {booking.service.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {booking.customer.name ||
                                  booking.customer.email ||
                                  "Customer"}
                                {" · "}#{booking.bookingNumber}
                              </p>
                              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Clock size={15} />
                                {formatTime(booking.preferredTime)}
                              </p>
                              <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
                                <MapPin size={15} className="mt-0.5 shrink-0" />
                                <span>{booking.address}</span>
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  statusStyles[booking.status] ??
                                  "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {booking.status.replaceAll("_", " ")}
                              </span>
                              <Link
                                href={`/admin/bookings/${booking.id}`}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                View booking
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {filteredBookings.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
            <CalendarDays className="mx-auto text-slate-400" size={32} />
            <p className="mt-3 font-semibold text-slate-800">
              No bookings match these filters
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try selecting another status or service category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}