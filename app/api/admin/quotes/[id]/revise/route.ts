import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
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
        { message: "Only administrators can revise quotes." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const result = await db.$transaction(async (tx) => {
      const original = await tx.quote.findUnique({
        where: { id },
        include: {
          revisions: { select: { id: true } },
        },
      });

      if (!original) {
        return { kind: "NOT_FOUND" as const };
      }

      if (original.status === "ACCEPTED") {
        return { kind: "ACCEPTED" as const };
      }

      if (original.revisions.length > 0) {
        return { kind: "HAS_REVISION" as const };
      }

      if (
        ![
          "DRAFT",
          "SENT",
          "DECLINED",
          "EXPIRED",
          "WITHDRAWN",
        ].includes(original.status)
      ) {
        return { kind: "INVALID_STATUS" as const };
      }

      // Retire active versions before creating a replacement.
      if (original.status === "DRAFT" || original.status === "SENT") {
        const retired = await tx.quote.updateMany({
          where: {
            id: original.id,
            status: original.status,
          },
          data: { status: "WITHDRAWN" },
        });

        if (retired.count !== 1) {
          return { kind: "CONFLICT" as const };
        }
      }

      const revision = await tx.quote.create({
        data: {
          quoteNumber: `SAMB-Q-${new Date()
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "")}-${crypto.randomUUID()
            .replaceAll("-", "")
            .slice(0, 8)
            .toUpperCase()}`,
          bookingId: original.bookingId,
          createdById: session.user.id,
          revision: original.revision + 1,
          previousQuoteId: original.id,
          amount: original.amount,
          currency: original.currency,
          breakdown:
            original.breakdown === null
              ? Prisma.DbNull
              : (original.breakdown as Prisma.InputJsonValue),
          terms: original.terms,
          status: "DRAFT",
          expiresAt: null,
          sentAt: null,
          respondedAt: null,
          responseNote: null,
        },
      });

      return {
        kind: "CREATED" as const,
        revision,
      };
    });

    if (result.kind === "NOT_FOUND") {
      return NextResponse.json(
        { message: "Quote not found." },
        { status: 404 }
      );
    }

    if (result.kind === "ACCEPTED") {
      return NextResponse.json(
        { message: "An accepted quote cannot be revised. Create a new quote for any additional work." },
        { status: 409 }
      );
    }

    if (result.kind === "HAS_REVISION") {
      return NextResponse.json(
        { message: "This quote already has a newer revision. Open the latest version instead." },
        { status: 409 }
      );
    }

    if (result.kind === "INVALID_STATUS") {
      return NextResponse.json(
        { message: "This quote cannot be revised in its current status." },
        { status: 409 }
      );
    }

    if (result.kind === "CONFLICT") {
      return NextResponse.json(
        { message: "The quote changed while you were revising it. Refresh and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: `Revision ${result.revision.revision} created as a draft.`,
        quote: result.revision,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A newer revision has already been created. Refresh the page." },
        { status: 409 }
      );
    }

    console.error("Failed to revise quote:", error);

    return NextResponse.json(
      { message: "Unable to create a quote revision." },
      { status: 500 }
    );
  }
}