"use client";

import { useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string | Date;
};

export default function NotificationsList({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [notifications, setNotifications] =
    useState(initialNotifications);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  async function markAsRead(id: string) {
    setBusyId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update notification.");
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setSuccess("Notification marked as read.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function markAllAsRead() {
    setBusyId("all");
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update notifications.");
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setSuccess("All notifications marked as read.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {unreadCount} unread
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Your notifications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep track of your booking updates from SAMB.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || busyId !== null}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busyId === "all" ? "Updating..." : "Mark all as read"}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </p>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🔔
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            No notifications yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Booking updates will appear here when they are available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border p-5 ${
                notification.isRead
                  ? "border-slate-200 bg-white"
                  : "border-blue-200 bg-blue-50/60"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    notification.isRead ? "bg-slate-300" : "bg-blue-600"
                  }`}
                  aria-label={notification.isRead ? "Read" : "Unread"}
                  title={notification.isRead ? "Read" : "Unread"}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    disabled={busyId !== null}
                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {busyId === notification.id
                      ? "Updating..."
                      : "Mark as read"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}