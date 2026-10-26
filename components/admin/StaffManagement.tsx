"use client";

import { useState, type FormEvent } from "react";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  activeAssignmentCount: number;
};

type Props = {
  initialStaff: StaffMember[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StaffManagement({ initialStaff }: Props) {
  const [staff, setStaff] = useState(initialStaff);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        setError(result.message || "Unable to create staff account.");
        return;
      }

      const refresh = await fetch("/api/admin/staff", {
        cache: "no-store",
      });

      if (refresh.ok) {
        const data = (await refresh.json()) as {
          staff: StaffMember[];
        };
        setStaff(data.staff);
      }

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSuccess(result.message || "Staff account created.");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          Admin workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Staff management
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create staff accounts and monitor each team member&apos;s active
          booking assignments.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Staff directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {staff.length} staff account{staff.length === 1 ? "" : "s"}
            </p>
          </div>

          {staff.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-800">
                No staff accounts yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first staff account using the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {member.name}
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {member.email}
                    </p>
                    {member.phone && (
                      <p className="mt-1 text-sm text-slate-500">
                        {member.phone}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      Created {formatDate(member.createdAt)}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-xl bg-blue-50 px-4 py-3">
                    <p className="text-2xl font-bold text-blue-800">
                      {member.activeAssignmentCount}
                    </p>
                    <p className="text-xs text-blue-700">
                      Active assignments
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Create staff account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The email address must not already belong to another account.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 p-5">
            {error && (
              <div role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
                {error}
              </div>
            )}
            {success && (
              <div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="staff-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="staff-name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="staff-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="staff-email"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="staff-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                Phone number (optional)
              </label>
              <input
                id="staff-phone"
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="staff-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Initial password
              </label>
              <input
                id="staff-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use at least 10 characters and share the initial password securely.
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Creating account..." : "Create staff account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
