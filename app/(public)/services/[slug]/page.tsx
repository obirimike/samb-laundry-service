
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Sparkles,
  WashingMachine,
} from "lucide-react";
import { db } from "@/lib/db";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;

  const service = await db.service.findFirst({
    where: { slug, isActive: true },
  });

  if (!service) {
    return { title: "Service not found | SAMB's" };
  }

  return {
    title: `${service.name} | SAMB's Laundry and Klinin Services`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await db.service.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });

  if (!service) {
    notFound();
  }

  const isLaundry = service.category === "LAUNDRY";

  return (
    <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white"
            >
              <ArrowLeft size={17} /> All services
            </Link>

            <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
              {isLaundry ? (
                <WashingMachine size={28} />
              ) : (
                <Sparkles size={28} />
              )}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
              {isLaundry ? "Laundry care" : "Cleaning service"}
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              {service.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              {service.description}
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white hover:bg-blue-400"
            >
              Request this service <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
              <h2 className="text-2xl font-extrabold text-slate-900">
                About this service
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                {service.description} The final scope of work can be discussed
                with the SAMB&apos;s team based on your property, requirements
                and preferred schedule.
              </p>

              <h3 className="mt-9 text-lg font-bold text-slate-900">
                What to expect
              </h3>

              <ul className="mt-5 space-y-4">
                {[
                  "Discuss your requirements and any special instructions.",
                  "Review the scope of work and preferred date.",
                  "Confirm the service details and agreed price with the team.",
                  "Arrange service delivery and provide feedback afterward.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-1 shrink-0 text-blue-700"
                    />
                    <span className="leading-7 text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-blue-700" size={22} />
                  <h3 className="font-bold text-slate-900">
                    Flexible scheduling
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Tell us your preferred date and timing when requesting the
                  service. Your booking remains a request until the team
                  confirms it.
                </p>
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900">
                Request information
              </h2>

              <div className="mt-6 border-b border-slate-100 pb-5">
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-1 font-bold text-slate-900">
                  Quotation on request
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Pricing depends on the work required and the scope agreed.
                </p>
              </div>

              <div className="border-b border-slate-100 py-5">
                <p className="text-sm text-slate-500">Service category</p>
                <p className="mt-1 font-bold text-slate-900">
                  {isLaundry ? "Laundry" : "Cleaning"}
                </p>
              </div>

              <div className="py-5">
                <p className="text-sm text-slate-500">Next step</p>
                <p className="mt-1 leading-6 text-slate-700">
                  Create an account to submit your preferred date and service
                  details.
                </p>
              </div>

              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-semibold text-white hover:bg-blue-800"
              >
                Request service <ArrowRight size={17} />
              </Link>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <MessageCircle size={15} className="mt-0.5 shrink-0" />
                Requests are reviewed before a booking is confirmed.
              </p>
            </aside>
          </div>
        </section>
      </main>
  );
}
