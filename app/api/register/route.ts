
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { limitRequest, rateLimitHeaders } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
  phone: z.string().trim().max(30).optional(),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await limitRequest(request, "registration");

    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { message: "Too many registration attempts. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rateLimit) }
      );
    }

    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please provide a valid name, email, and password of at least 8 characters." },
        { status: 400 }
      );
    }

    const { name, password, phone } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: "CUSTOMER",
      },
      select: { id: true },
    });

    return NextResponse.json(
      { message: "Account created successfully. You can now log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Unable to create your account right now." },
      { status: 500 }
    );
  }
}
