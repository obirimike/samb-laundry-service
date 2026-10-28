import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const moderationSchema = z
  .object({
    reviewId: z.string().uuid(),
    status: z.enum(["PUBLISHED", "HIDDEN"]),
    moderationNote: z.string().trim().max(2000).optional(),
  })
  .strict();

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must sign in to moderate reviews." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to moderate reviews." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const parsed = moderationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid moderation details.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { reviewId, status, moderationNote } = parsed.data;

    const review = await db.review.update({
      where: { id: reviewId },
      data: {
        status,
        moderationNote: moderationNote || null,
        moderatedById: session.user.id,
        moderatedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        moderationNote: true,
        moderatedAt: true,
        moderatedById: true,
      },
    });

    return NextResponse.json({
      message:
        status === "PUBLISHED"
          ? "Review published successfully."
          : "Review hidden successfully.",
      review,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    console.error("Review moderation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while moderating this review." },
      { status: 500 }
    );
  }
}
