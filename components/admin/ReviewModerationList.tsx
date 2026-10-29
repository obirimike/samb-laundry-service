"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "PENDING" | "PUBLISHED" | "HIDDEN";
type FilterStatus = "ALL" | ReviewStatus;

type AdminReview = {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  moderationNote: string | null;
  moderatedAt: string | null;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  service: {
    name: string;
  };
  booking: {
    bookingNumber: string;
    status: string;
    preferredDate: string;
    preferredTime: string;
  };
};

type Props = {
  initialReviews: AdminReview[];
};

const filters: FilterStatus[] = [
  "ALL",
  "PENDING",
  "PUBLISHED",
  "HIDDEN",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function statusLabel(status: ReviewStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function ReviewModerationList({
  initialReviews,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<FilterStatus>("PENDING");
  const [notes, setNotes] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        initialReviews.map((review) => [
          review.id,
          review.moderationNote ?? "",
        ])
      ) as Record<string, string>
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const visibleReviews = useMemo(
    () =>
      reviews.filter(
        (review) => filter === "ALL" || review.status === filter
      ),
    [reviews, filter]
  );

  const counts = useMemo(
    () => ({
      ALL: reviews.length,
      PENDING: reviews.filter((r) => r.status === "PENDING").length,
      PUBLISHED: reviews.filter((r) => r.status === "PUBLISHED").length,
      HIDDEN: reviews.filter((r) => r.status === "HIDDEN").length,
    }),
    [reviews]
  );

  async function moderateReview(
    reviewId: string,
    status: "PUBLISHED" | "HIDDEN"
  ) {
    setBusyId(reviewId);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          status,
          moderationNote: notes[reviewId] ?? "",
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "Unable to update this review."
        );
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: payload.review.status as ReviewStatus,
                moderationNote: payload.review.moderationNote,
                moderatedAt: payload.review.moderatedAt,
              }
            : review
        )
      );

      setFeedback({
        type: "success",
        message:
          status === "PUBLISHED"
            ? "Review published successfully."
            : "Review hidden successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-xl border p-4 text-left transition ${
              filter === item
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm">
              {item === "ALL" ? "All reviews" : statusLabel(item)}
            </span>
            <span className="mt-1 block text-2xl font-semibold">
              {counts[item]}
            </span>
          </button>
        ))}
      </div>

      {feedback && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {visibleReviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-900">
            No {filter === "ALL" ? "" : filter.toLowerCase() + " "}reviews
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Reviews matching this filter will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleReviews.map((review) => {
            const isBusy = busyId === review.id;

            return (
              <article
                key={review.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Booking {review.booking.bookingNumber}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {review.service.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Customer: {review.customer.name} (
                      {review.customer.email})
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      review.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : review.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {statusLabel(review.status)}
                  </span>
                </div>

                <div className="mt-4">
                  <p
                    className="text-lg tracking-wide text-amber-500"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                    <span className="text-slate-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      {review.rating}/5
                    </span>
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {review.comment || "The customer left a rating without a comment."}
                  </p>
                </div>

                <div className="mt-4 grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-slate-800">
                      Booking date:
                    </span>{" "}
                    {formatDate(review.booking.preferredDate)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">
                      Review submitted:
                    </span>{" "}
                    {formatDateTime(review.createdAt)}
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor={`moderation-note-${review.id}`}
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    Internal moderation note
                  </label>

                  <textarea
                    id={`moderation-note-${review.id}`}
                    value={notes[review.id] ?? ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [review.id]: event.target.value,
                      }))
                    }
                    maxLength={2000}
                    rows={3}
                    placeholder="Optional note explaining the moderation decision"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    This note is for admin use and is not displayed as the customer's public review.
                  </p>
                </div>

                {review.moderatedAt && (
                  <p className="mt-3 text-xs text-slate-500">
                    Last moderated: {formatDateTime(review.moderatedAt)}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {review.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        moderateReview(review.id, "PUBLISHED")
                      }
                      className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? "Saving..." : "Publish review"}
                    </button>
                  )}

                  {review.status !== "HIDDEN" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => moderateReview(review.id, "HIDDEN")}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? "Saving..." : "Hide review"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
