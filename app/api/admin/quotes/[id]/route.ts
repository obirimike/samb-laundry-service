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

    if (!emailResult.success) {
      return NextResponse.json(
        {
          message:
            "The quote email could not be sent. The quote remains a draft. Check your Resend configuration and try again.",
        },
        { status: 502 }
      );
    }

    const updated = await db.quote.updateMany({
      where: {
        id: quote.id,
        status: "DRAFT",
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    if (updated.count !== 1) {
      console.error(
        `Quote ${quote.id} was emailed, but its status changed before it could be updated.`
      );

      return NextResponse.json(
        {
          message:
            "The email was sent, but the quote status changed concurrently. Refresh the quote list and verify its status.",
        },
        { status: 409 }
      );
    }

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
      message: "Quote emailed to the customer successfully.",
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