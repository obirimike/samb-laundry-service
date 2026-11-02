import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must sign in to continue." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only administrators can send quotes." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const quote = await db.quote.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            service: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { message: "Quote not found." },
        { status: 404 }
      );
    }

    if (quote.status !== "DRAFT") {
      return NextResponse.json(
        { message: "Only draft quotes can be sent." },
        { status: 409 }
      );
    }

    const now = new Date();

    if (quote.expiresAt && quote.expiresAt <= now) {
      await db.quote.updateMany({
        where: { id: quote.id, status: "DRAFT" },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        { message: "This quote has expired. Edit the expiry or create a new quote." },
        { status: 409 }
      );
    }

    // Persist database changes independently of email delivery.
    const updated = await db.quote.updateMany({
      where: {
        id: quote.id,
        status: "DRAFT",
      },
      data: {
        status: "SENT",
        sentAt: now,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json(
        {
          message:
            "The quote status changed concurrently. Refresh the quote list and verify its status.",
        },
        { status: 409 }
      );
    }

    // Create in-app notification independently of email delivery.
    try {
      await db.notification.create({
        data: {
          userId: quote.booking.customer.id,
          title: "A service quote is ready",
          message: `Quote ${quote.quoteNumber} is ready for booking ${quote.booking.bookingNumber}.`,
          type: "QUOTE_SENT",
        },
      });
    } catch (notifError) {
      console.error("Failed to create quote sent notification:", notifError);
    }

    // Email delivery is optional and failures must not break the workflow.
    const emailResult = await sendQuoteEmail({
      to: quote.booking.customer.email,
      customerName: quote.booking.customer.name,
      quoteNumber: quote.quoteNumber,
      bookingNumber: quote.booking.bookingNumber,
      serviceName: quote.booking.service.name,
      amount: quote.amount.toString(),
      currency: quote.currency,
      breakdown: quote.breakdown,
      terms: quote.terms,
      expiresAt: quote.expiresAt,
    });

    const updatedQuote = await db.quote.findUnique({
      where: { id: quote.id },
      select: {
        id: true,
        quoteNumber: true,
        status: true,
        sentAt: true,
      },
    });

    return NextResponse.json({
      message: emailResult.success
        ? "Quote sent to the customer successfully."
        : "The quote is available in the customer's account, but the email notification could not be delivered.",
      emailSent: emailResult.success,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Failed to send quote:", error);

    return NextResponse.json(
      { message: "Unable to send the quote right now." },
      { status: 500 }
    );
  }
}
