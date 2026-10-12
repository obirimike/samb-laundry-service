
import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] bg-slate-50">
        <section className="bg-[#031c43] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
              Contact us
            </p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-5 max-w-2xl leading-8 text-slate-300">
              Tell us what kind of cleaning or laundry service you need.
              Submit a service request through your account, and our team can
              review the details with you.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-7">
            <span className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-700">
              <ClipboardList size={25} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Request a service
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Choose a service, share your preferred date and location, and
              provide any special instructions. Booking requests are reviewed
              before confirmation.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
            >
              Browse services <ArrowRight size={17} />
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-7">
            <span className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <MessageCircle size={25} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Already a customer?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sign in to access your account. Your booking dashboard will let
              you review your service requests as we complete the booking
              workflow.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
            >
              Sign in to your account <ArrowRight size={17} />
            </Link>
          </article>
        </section>
      </main>
  );
}
