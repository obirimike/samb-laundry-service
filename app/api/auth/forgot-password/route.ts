
import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/emails";
import { limitRequest, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z
  .object({
    email: z.string().trim().email().max(254),
  })
  .strict();

const genericResponse = {
  message:
    "If an account exists with that email address, password reset instructions will be sent.",
};

export async function POST(request: Request) {
  try {
    const rateLimit = await limitRequest(request, "passwordReset");

    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(genericResponse, {
        status: 200,
        headers: rateLimitHeaders(rateLimit),
      });
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

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(genericResponse);
    }

    const rawToken = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await db.$transaction([
      db.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      db.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!appUrl) {
      console.error("Password reset email unavailable: NEXT_PUBLIC_APP_URL is missing.");
      return NextResponse.json(genericResponse);
    }

    const resetUrl = new URL("/reset-password", appUrl);
    resetUrl.searchParams.set("token", rawToken);

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      customerName: user.name,
      resetUrl: resetUrl.toString(),
    });

    if (!emailResult.success) {
      await db.passwordResetToken.updateMany({
        where: {
          tokenHash,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("Forgot password request failed:", error);

    return NextResponse.json(genericResponse);
  }
}
