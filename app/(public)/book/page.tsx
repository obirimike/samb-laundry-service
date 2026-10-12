
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import BookingForm from "@/components/booking/BookingForm";


type BookingPageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function BookingPage({
  searchParams,
}: BookingPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=%2Fbook");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/account");
  }

  const query = await searchParams;

  const services = await db.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      slug: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const selectedService = query.service
    ? services.find((service) => service.slug === query.service)
    : undefined;

  return (
    <>

      <main className="min-h-screen bg-slate-50">
        <section className="bg-[#031c43] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex rounded-xl bg-white/10 p-3 text-blue-200">
              <ClipboardList size={28} />
            </div>
            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              Request a service
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Tell us what you need and when you would prefer the service.
              Our team will review your request and discuss availability and
              pricing before confirming your booking.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-1 font-semibold text-slate-900">
                {session.user.name || session.user.email}
              </p>
            </div>

            <BookingForm
              services={services.map((service) => ({
                id: service.id,
                name: service.name,
                category: service.category,
                slug: service.slug,
                description: (service as { description?: string }).description,
              }))}
              initialServiceId={selectedService?.id}
            />
          </div>
        </section>
      </main>


    </>
  );
}
