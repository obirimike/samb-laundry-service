
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus, Save } from "lucide-react";

import { ServiceCategory } from "@/types/service";

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  imageUrl: string | null;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  category: "CLEANING" as ServiceCategory,
  imageUrl: "",
};

export default function ServiceManager({
  services,
}: {
  services: ServiceItem[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function startEditing(service: ServiceItem) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      category: service.category,
      imageUrl: service.imageUrl || "",
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function saveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        editingId
          ? `/api/admin/services/${editingId}`
          : "/api/admin/services",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            slug: makeSlug(form.slug),
            imageUrl: form.imageUrl.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save the service.");
        return;
      }

      setMessage(data.message || "Service saved successfully.");
      setEditingId(null);
      setForm(emptyForm);
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleService(service: ServiceItem) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to change service status.");
        return;
      }

      setMessage(
        `${service.name} is now ${service.isActive ? "inactive" : "active"}.`
      );
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={saveService}
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      >
        <h2 className="text-xl font-bold text-slate-900">
          {editingId ? "Edit service" : "Add a service"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Use a descriptive name and URL-friendly slug. Prices remain negotiable
          and can be discussed with customers.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Service name
            <input
              required
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={(event) => {
                const name = event.target.value;
                setForm((previous) => ({
                  ...previous,
                  name,
                  ...(editingId ? {} : { slug: makeSlug(name) }),
                }));
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="e.g. Office Cleaning"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            URL slug
            <input
              required
              value={form.slug}
              onChange={(event) =>
                updateField("slug", makeSlug(event.target.value))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="office-cleaning"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Category
            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value as ServiceCategory)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="CLEANING">Cleaning</option>
              <option value="LAUNDRY">Laundry</option>
              <option value="DOMESTIC_SUPPORT">Domestic Support</option>
              <option value="PEST_CONTROL">Pest Control</option>
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Image URL (optional)
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="https://..."
            />
          </label>

          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Description
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Describe what this service includes..."
            />
          </label>
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

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {busy ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : editingId ? (
              <Save size={18} />
            ) : (
              <Plus size={18} />
            )}
            {busy ? "Saving..." : editingId ? "Save changes" : "Add service"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Stop editing
            </button>
          )}
        </div>
      </form>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Existing services
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Inactive services remain in historical bookings but should not be
            offered for new requests.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No services found.
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {service.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        service.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                    {service.category}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>
                  <p className="mt-2 break-all text-xs text-slate-400">
                    /services/{service.slug}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startEditing(service)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => toggleService(service)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${
                      service.isActive
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
