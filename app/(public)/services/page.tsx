import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import ServiceGrid from "@/components/services/ServiceGrid";
import { ServiceItem } from "@/types/service";

export const metadata = {
  title: "Services & Laundry | SAMB's Cleaning Services",
  description:
    "Explore SAMB's professional laundry care and comprehensive cleaning solutions for homes, businesses, and venues.",
};

export default async function ServicesPage() {
  const rawServices = await db.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const services: ServiceItem[] = rawServices.map((service) => ({
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    category: service.category as "CLEANING" | "LAUNDRY",
    imageUrl: service.imageUrl,
    isActive: service.isActive,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 bg-[#031c43]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
            <Sparkles size={14} />
            Professional Cleaning &amp; Laundry
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Our Cleaning &amp; Laundry Services
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Choose from personalized cleaning packages and full laundry care.
            Every request is handled with meticulous attention to detail and care.
          </p>
        </div>
      </section>

      {/* Services Grid with Interactive Tabs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ServiceGrid services={services} enableFilterTabs={true} />

        {/* Custom Help Box */}
        <div className="mt-16 rounded-3xl bg-[#031c43] p-8 text-white shadow-lg sm:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Not sure which service fits your space?
            </h2>
            <p className="mt-3 leading-relaxed text-blue-100">
              Tell us about your requirements or custom laundry schedule. Our
              team will review your request and help you find the right fit.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Request custom booking <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
