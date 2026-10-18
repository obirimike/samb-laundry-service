"use client";

import { useMemo, useState, type FormEvent } from "react";

type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "WITHDRAWN";

type BookingOption = {
  id: string;
  bookingNumber: string;
  status: string;
  preferredDate: string;
  preferredTime: string;
  customer: {
    name: string;
    email: string;
  };
  service: {
    name: string;
    category: string;
  };
};

type QuoteRecord = {
  id: string;
  quoteNumber: string;
  amount: string | number;
  currency: string;
  status: QuoteStatus;
  terms: string | null;
  breakdown: unknown;
  createdAt: string;
  expiresAt: string | null;
  sentAt: string | null;
  respondedAt: string | null;
  booking: {
    id: string;
    bookingNumber: string;
    status: string;
    preferredDate: string;
    preferredTime: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
    service: {
      name: string;
      category: string;
    };
  };
  createdBy: {
    id: string;
    name: string | null;
  };
};

type FormLineItem = {
  rowId: number;
  description: string;
  quantity: string;
  unitPrice: string;
};

type Props = {
  initialQuotes: QuoteRecord[];
  bookings: BookingOption[];
};

const statuses: QuoteStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
  "WITHDRAWN",
];

const statusStyles: Record<QuoteStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  DECLINED: "bg-rose-100 text-rose-800",
  EXPIRED: "bg-amber-100 text-amber-800",
  WITHDRAWN: "bg-gray-100 text-gray-600",
};

function formatMoney(amount: number | string, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
}

export default function QuoteManagement({
  initialQuotes,
  bookings,
}: Props) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState("");
  const [terms, setTerms] = useState(
    "50% upfront and 50% on completion."
  );
  const [expiresAt, setExpiresAt] = useState("");
  const [items, setItems] = useState<FormLineItem[]>([
    {
      rowId: 1,
      description: "",
      quantity: "1",
      unitPrice: "",
    },
  ]);
  const [nextRowId, setNextRowId] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sendingQuoteId, setSendingQuoteId] = useState<string | null>(null);

  async function handleSendQuote(quoteId: string) {
    const confirmed = window.confirm(
      "Send this quote to the customer's email address?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setSendingQuoteId(quoteId);

    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}/send`, {
        method: "POST",
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        setError(result.message || "Unable to send this quote.");
        return;
      }

      setSuccess(result.message || "Quote sent successfully.");

      const refreshResponse = await fetch("/api/admin/quotes", {
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const refreshed = (await refreshResponse.json()) as {
          quotes: QuoteRecord[];
        };

        setQuotes(refreshed.quotes);
      }
    } catch {
      setError("A network error occurred while sending the quote.");
    } finally {
      setSendingQuoteId(null);
    }
  }

  const stats = useMemo(
    () => ({
      total: quotes.length,
      drafts: quotes.filter((quote) => quote.status === "DRAFT").length,
      sent: quotes.filter((quote) => quote.status === "SENT").length,
      accepted: quotes.filter((quote) => quote.status === "ACCEPTED").length,
    }),
    [quotes]
  );

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "ALL" || quote.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          quote.quoteNumber,
          quote.booking.bookingNumber,
          quote.booking.customer.name,
          quote.booking.customer.email,
          quote.booking.service.name,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [quotes, search, statusFilter]);

  const estimatedTotal = items.reduce((total, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);

    if (
      !Number.isFinite(quantity) ||
      !Number.isFinite(unitPrice) ||
      quantity <= 0 ||
      unitPrice < 0
    ) {
      return total;
    }

    return total + quantity * unitPrice;
  }, 0);

  function updateItem(
    rowId: number,
    field: keyof Omit<FormLineItem, "rowId">,
    value: string
  ) {
    setItems((current) =>
      current.map((item) =>
        item.rowId === rowId ? { ...item, [field]: value } : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        rowId: nextRowId,
        description: "",
        quantity: "1",
        unitPrice: "",
      },
    ]);

    setNextRowId((current) => current + 1);
  }

  function removeItem(rowId: number) {
    setItems((current) => current.filter((item) => item.rowId !== rowId));
  }

  async function handleCreateQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedBooking) {
      setError("Please select a booking.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one cost item.");
      return;
    }

    const invalidItem = items.some((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      return (
        !item.description.trim() ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0 ||
        !Number.isSafeInteger(Math.round(unitPrice * 100))
      );
    });

    if (invalidItem) {
      setError(
        "Enter a description, a whole-number quantity, and a valid unit price for every item."
      );
      return;
    }

    if (estimatedTotal <= 0) {
      setError("The total quote amount must be greater than zero.");
      return;
    }

    let expiryIso: string | undefined;

    if (expiresAt) {
      // Treat the selected expiry day as ending at 23:59:59 UTC.
      expiryIso = `${expiresAt}T23:59:59.000Z`;

      if (new Date(expiryIso).getTime() <= Date.now()) {
        setError("Choose an expiry date in the future.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: selectedBooking,
          items: items.map((item) => ({
            description: item.description.trim(),
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
          terms: terms.trim() || undefined,
          expiresAt: expiryIso,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        errors?: unknown;
      };

      if (!response.ok) {
        setError(result.message || "Unable to create the quote.");
        return;
      }

      setSuccess(result.message || "Draft quote created successfully.");
      setSelectedBooking("");
      setTerms("50% upfront and 50% on completion.");
      setExpiresAt("");
      setItems([
        {
          rowId: nextRowId,
          description: "",
          quantity: "1",
          unitPrice: "",
        },
      ]);
      setNextRowId((current) => current + 1);

      // Reload the authoritative list from the server.
      const refreshResponse = await fetch("/api/admin/quotes", {
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const refreshed = (await refreshResponse.json()) as {
          quotes: QuoteRecord[];
        };

        setQuotes(refreshed.quotes);
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-700">
            Admin workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-100 ">
            Quotes &amp; Pricing
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Prepare clear, itemized service quotations for customers and track
            their current status.
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span className="font-semibold">Currency:</span> Ghana cedi (GHS)
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 text-black">
        {[
          { label: "All quotes", value: stats.total },
          { label: "Drafts", value: stats.drafts },
          { label: "Sent", value: stats.sent },
          { label: "Accepted", value: stats.accepted },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Quote records</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by quote, booking, customer, or service.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_170px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search quotes..."
                aria-label="Search quotes"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                ₵
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {quotes.length === 0 ? "No quotes created yet" : "No matches found"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {quotes.length === 0
                  ? "Choose a booking and prepare your first quotation using the form."
                  : "Try another search term or choose a different status filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Quote</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="align-top hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {quote.quoteNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {quote.booking.bookingNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {quote.booking.service.name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {quote.booking.customer.name}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {quote.booking.customer.email}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                        {formatMoney(quote.amount, quote.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[quote.status]
                          }`}
                        >
                          {statusLabel(quote.status)}
                        </span>
                        {quote.status === "DRAFT" && (
  <button
    type="button"
    disabled={sendingQuoteId === quote.id}
    onClick={() => handleSendQuote(quote.id)}
    className="mt-2 block whitespace-nowrap rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {sendingQuoteId === quote.id ? "Sending..." : "Send quote"}
  </button>
)}

                        {quote.expiresAt && (
                          <p className="mt-2 whitespace-nowrap text-xs text-slate-500">
                            Expires {formatDate(quote.expiresAt)}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(quote.createdAt)}
                      </td>

                      <td className="px-5 py-4">
  {(quote.status === "DRAFT" || quote.status === "SENT") && (
    <button
      type="button"
      onClick={() => handleSendQuote(quote.id)}
      disabled={sendingQuoteId !== null}
      className="whitespace-nowrap rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {sendingQuoteId === quote.id
        ? "Sending..."
        : quote.status === "DRAFT"
          ? "Send quote"
          : "Resend email"}
    </button>
  )}

  {quote.status !== "DRAFT" && quote.status !== "SENT" && (
    <span className="text-xs text-slate-400">No action</span>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <p className="text-sm font-semibold text-blue-700">
              Create a quotation
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              New draft quote
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select a booking, enter each cost item, and save the draft for
              review.
            </p>
          </div>

          <form onSubmit={handleCreateQuote} className="space-y-5 p-5 sm:p-6">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="bookingId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Booking
              </label>

              <select
                id="bookingId"
                required
                value={selectedBooking}
                onChange={(event) => setSelectedBooking(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.bookingNumber} — {booking.customer.name} —{" "}
                    {booking.service.name}
                  </option>
                ))}
              </select>

              {bookings.length === 0 && (
                <p className="mt-2 text-xs text-amber-700">
                  There are no eligible bookings to quote.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Itemized costs
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  + Add item
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={item.rowId}
                  className="space-y-3 rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Item {index + 1}
                    </p>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.rowId)}
                        className="text-xs font-medium text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`description-${item.rowId}`}
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      Description
                    </label>
                    <input
                      id={`description-${item.rowId}`}
                      required
                      maxLength={200}
                      value={item.description}
                      onChange={(event) =>
                        updateItem(
                          item.rowId,
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="e.g. Deep cleaning"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={`quantity-${item.rowId}`}
                        className="mb-1.5 block text-xs font-medium text-slate-600"
                      >
                        Quantity
                      </label>
                      <input
                        id={`quantity-${item.rowId}`}
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.rowId, "quantity", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`price-${item.rowId}`}
                        className="mb-1.5 block text-xs font-medium text-slate-600"
                      >
                        Unit price (GHS)
                      </label>
                      <input
                        id={`price-${item.rowId}`}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateItem(
                            item.rowId,
                            "unitPrice",
                            event.target.value
                          )
                        }
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-sm">
                    <span className="text-slate-500">Line total</span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(
                        Math.max(0, Number(item.quantity) || 0) *
                          Math.max(0, Number(item.unitPrice) || 0)
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-sm text-slate-300">Estimated quote total</p>
              <p className="mt-1 text-3xl font-bold">
                {formatMoney(estimatedTotal)}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                The server recalculates the actual saved total.
              </p>
            </div>

            <div>
              <label
                htmlFor="expiresAt"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Quote expiry date <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="expiresAt"
                type="date"
                min={new Date().toLocaleDateString("en-CA", {
                  timeZone: "UTC",
                })}
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="terms"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Terms and conditions
              </label>
              <textarea
                id="terms"
                rows={3}
                maxLength={5000}
                value={terms}
                onChange={(event) => setTerms(event.target.value)}
                placeholder="Payment terms, exclusions, or other conditions..."
                className="w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || bookings.length === 0}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating draft..." : "Create draft quote"}
            </button>

            <p className="text-xs leading-5 text-slate-500">
              Creating this draft does not send an email, confirm the booking,
              or record a payment.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}