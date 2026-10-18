import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { expireSentQuotes } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lineItemSchema = z
  .object({
    description: z.string().trim().min(1).max(200),
    quantity: z.number().finite().positive().max(100000),
    unitPrice: z.number().finite().nonnegative().max(100000000),
  })
  .strict();

const createQuoteSchema = z
  .object({
    bookingId: z.string().uuid(),
    items: z.array(lineItemSchema).min(1).max(50),
    terms: z.string().trim().max(5000).optional(),
    expiresAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

function getQuoteNumber() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  return `SAMB-Q-${date}-${randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;
}

function calculateQuote(items: z.infer<typeof lineItemSchema>[]) {
  // Use integer pesewas to avoid floating-point currency arithmetic.
  const lineItems = items.map((item) => {
    const unitPricePesewas = Math.round(item.unitPrice * 100);
    const lineTotalPesewas =
      Math.round(item.quantity * 100) * unitPricePesewas / 100;

    if (
      !Number.isSafeInteger(unitPricePesewas) ||
      !Number.isSafeInteger(lineTotalPesewas)
    ) {
      throw new Error("A quote item exceeds the supported amount.");
    }

    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: unitPricePesewas / 100,
      total: lineTotalPesewas / 100,
      totalPesewas: lineTotalPesewas,
    };
  });

  const totalPesewas = lineItems.reduce(
    (sum, item) => sum + item.totalPesewas,
    0
  );

  if (!Number.isSafeInteger(totalPesewas) || totalPesewas <= 0) {
    throw new Error("The quote total must be greater than zero.");
  }

  return {
    amount: (totalPesewas / 100).toFixed(2),
    breakdown: lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
  };
}

// GET /api/admin/quotes
export async function GET() {
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
        { message: "You are not authorized to view quotes." },
        { status: 403 }
      );
    }

    await expireSentQuotes();

    const quotes = await db.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
            preferredDate: true,
            preferredTime: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            service: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Failed to list quotes:", error);

    return NextResponse.json(
      { message: "Unable to retrieve quotes right now." },
      { status: 500 }
    );
  }
}

// POST /api/admin/quotes
export async function POST(request: Request) {
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
        { message: "Only administrators can create quotes." },
        { status: 403 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Please provide valid JSON." },
        { status: 400 }
      );
    }

    const parsed = createQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please check the quote details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { bookingId, items, terms, expiresAt } = parsed.data;

    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
      return NextResponse.json(
        { message: "The expiry date must be in the future." },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        customerId: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { message: "You cannot create a quote for a cancelled booking." },
        { status: 400 }
      );
    }

    let calculated: ReturnType<typeof calculateQuote>;

    try {
      calculated = calculateQuote(items);
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Unable to calculate the quote.",
        },
        { status: 400 }
      );
    }

    const quote = await db.quote.create({
      data: {
        quoteNumber: getQuoteNumber(),
        bookingId: booking.id,
        createdById: session.user.id,
        amount: calculated.amount,
        currency: "GHS",
        breakdown: calculated.breakdown,
        terms: terms || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "DRAFT",
      },
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
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Draft quote created successfully.",
        quote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create quote:", error);

    return NextResponse.json(
      { message: "Unable to create the quote right now." },
      { status: 500 }
    );
  }
}