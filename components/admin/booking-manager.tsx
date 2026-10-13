
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

type BookingManagerProps = {
  bookingId: string;
  currentStatus: string;
  initialNotes: string;
};

const transitions: Record<string, { value: string; label: string }[]> = {
  PENDING: [
    { value: "CONFIRMED", label: "Confirm booking" },
    { value: "CANCELLED", label: "Cancel booking" },
  ],
  CONFIRMED: [
    { value: "IN_PROGRESS", label: "Mark service in progress" },
    { value: "CANCELLED", label: "Cancel booking" },
  ],
  IN_PROGRESS: [
    { value: "COMPLETED", label: "Mark service completed" },
    { value: "CANCELLED", label: "Cancel booking" },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

export default function BookingManager({
  bookingId,
  currentStatus,
  initialNotes,
}: BookingManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [adminNotes, setAdminNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const options = transitions[currentStatus] || [];

  async function saveChanges() {
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(status !== currentStatus ? { status } : {}),
          adminNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update this booking.");
        return;
      }

      setMessage(data.message || "Booking updated successfully.");
      router.refresh();
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-900">
        Manage booking
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Update the request as your team reviews it and delivers the service.
        Customers can see the booking status, but administrator notes remain
        private.
      </p>

      {options.length > 0 ? (
        <div className="mt-5">
          <label
            htmlFor="bookingStatus"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Change status
          </label>
          <select
            id="bookingStatus"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value={currentStatus}>
              Keep current status ({currentStatus.replaceAll("_", " ")})
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          This booking is {currentStatus.toLowerCase()} and cannot transition
          to another status in the current workflow.
        </p>
      )}

      <div className="mt-5">
        <label
          htmlFor="adminNotes"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Private administrator notes
        </label>
        <textarea
          id="adminNotes"
          rows={5}
          maxLength={3000}
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
          placeholder="Record internal follow-up, agreed scope, or other operational details."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <p className="mt-1 text-right text-xs text-slate-500">
          {adminNotes.length}/3000 characters
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={isSaving}
        onClick={saveChanges}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {isSaving ? "Saving changes..." : "Save changes"}
      </button>
    </section>
  );
}
