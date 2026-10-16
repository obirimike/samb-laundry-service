import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import CustomerQuotes from "@/components/account/CustomerQuotes";

export const dynamic = "force-dynamic";

export default async function AccountQuotesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/quotes");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/admin/quotes");
  }

  const quotes = await db.quote.findMany({
    where: {
      booking: {
        is: {
          customerId: session.user.id,
        },
      },
      status: {
        in: ["SENT", "ACCEPTED", "DECLINED", "EXPIRED", "WITHDRAWN"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      booking: {
        select: {
          bookingNumber: true,
          status: true,
          preferredDate: true,
          preferredTime: true,
          service: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      },
    },
  });

  const initialQuotes = quotes.map((quote) => ({
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    amount: quote.amount.toString(),
    currency: quote.currency,
    status: quote.status,
    breakdown: quote.breakdown,
    terms: quote.terms,
    createdAt: quote.createdAt.toISOString(),
    sentAt: quote.sentAt?.toISOString() ?? null,
    expiresAt: quote.expiresAt?.toISOString() ?? null,
    respondedAt: quote.respondedAt?.toISOString() ?? null,
    responseNote: quote.responseNote,
    booking: {
      bookingNumber: quote.booking.bookingNumber,
      status: quote.booking.status,
      preferredDate: quote.booking.preferredDate.toISOString(),
      preferredTime: quote.booking.preferredTime,
      service: quote.booking.service,
    },
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <CustomerQuotes initialQuotes={initialQuotes} />
    </main>
  );
}