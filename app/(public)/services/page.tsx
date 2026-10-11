
import Link from "next/link";
import { ArrowRight, Sparkles, WashingMachine } from "lucide-react";
import { db } from "@/lib/db";

export default async function ServicesPage() {
  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const cleaningServices = services.filter(
    (service) => service.category === "CLEANING"
  );
  const laundryServices = services.filter(
    (service) => service.category === "LAUNDRY"
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
            Our services
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Cleaning and laundry solutions for your needs
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            Explore our available services, choose what you need, and submit a
            request for our team to review.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <ServiceGroup
          title="Cleaning services"
          description="From routine upkeep to detailed cleaning for homes, workplaces, and special occasions."
          services={cleaningServices}
          icon="cleaning"
        />

        <ServiceGroup
          title="Laundry services"
          description="Laundry care options for washing, drying, folding, ironing, and fabric care."
          services={laundryServices}
          icon="laundry"
        />

        {services.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Services are being updated
            </h2>
            <p className="mt-2 text-slate-600">
              Please check back soon or contact our team for assistance.
            </p>
          </div>
        )}

        <section className="rounded-3xl bg-blue-700 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Not sure which service you need?
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            Describe the space and work required. Our team can review your
            request and help you discuss the appropriate service.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-800 hover:bg-blue-50"
          >
            Contact our team <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

function ServiceGroup({
  title,
  description,
  services,
  icon,
}: {
  title: string;
  description: string;
  services: ServiceItem[];
  icon: "cleaning" | "laundry";
}) {
  if (services.length === 0) return null;

  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 leading-7 text-slate-600">{description}</p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              {icon === "laundry" ? (
                <WashingMachine size={24} />
              ) : (
                <Sparkles size={24} />
              )}
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {service.name}
            </h3>
            <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
              {service.description}
            </p>
            <Link
              href={`/services/${service.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View service <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
