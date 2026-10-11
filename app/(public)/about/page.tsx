
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
              About SAMB&apos;s
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black sm:text-5xl">
              Professional cleaning, with care in every detail.
            </h1>
            <p className="mt-6 max-w-2xl leading-8 text-slate-300">
              SAMB&apos;s Laundry and Klinin Services provides cleaning
              solutions for homes, workplaces, properties, and events, while
              expanding its laundry and fabric-care services.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Our approach
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                We believe cleaning should be professional, reliable, and
                tailored to the needs of each client. Whether the work involves
                routine maintenance, a detailed deep clean, post-construction
                cleanup, or preparation for an event, our goal is to help
                create clean and comfortable spaces.
              </p>
              <p className="mt-4 leading-8 text-slate-600">
                We discuss the scope of work, scheduling, and pricing with
                clients before confirming a service so expectations are clear.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Sparkles,
                  title: "Attention to detail",
                  text: "A careful approach to the work and the spaces we serve.",
                },
                {
                  icon: ShieldCheck,
                  title: "Quality checks",
                  text: "Reviews and follow-up help us address client concerns.",
                },
                {
                  icon: Users,
                  title: "Client-focused",
                  text: "Service arrangements can be tailored to client needs.",
                },
                {
                  icon: CheckCircle2,
                  title: "Reliable service",
                  text: "We aim for professional and timely delivery.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
                    <Icon size={26} className="text-blue-700" />
                    <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-blue-700 p-8 text-white sm:p-10">
            <h2 className="text-2xl font-extrabold">
              Let&apos;s talk about your cleaning needs.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-blue-100">
              Explore our services and send a request for our team to review.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-blue-800 hover:bg-blue-50"
            >
              Explore services
            </Link>
          </div>
        </section>
      </main>
  );
}
