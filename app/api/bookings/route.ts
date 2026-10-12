
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  address: z.string().trim().min(5).max(500),
  propertyType: z.string().trim().max(100).optional(),
  numberOfRooms: z.number().int().min(1).max(500).optional(),
  estimatedSize: z.string().trim().max(100).optional(),
  specialInstructions: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please sign in before requesting a service." },
        { status: 401 }
      );
    }

    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { message: "Only customer accounts can submit service requests." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please check your booking details and try again.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const [year, month, day] = input.preferredDate.split("-").map(Number);
    const [hours, minutes] = input.preferredTime.split(":").map(Number);

    const dateIsValid =
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31 &&
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59;

    const preferredDate = new Date(
      Date.UTC(year, month - 1, day, 12, 0, 0)
    );

    const dateMatches =
      preferredDate.getUTCFullYear() === year &&
      preferredDate.getUTCMonth() === month - 1 &&
      preferredDate.getUTCDate() === day;

    if (!dateIsValid || !dateMatches) {
      return NextResponse.json(
        { message: "Please provide a valid preferred date and time." },
        { status: 400 }
      );
    }

    // Compare calendar dates in UTC for consistent date-only handling.
    const today = new Date();
    const todayUtc = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );

    if (preferredDate.getTime() < todayUtc) {
      return NextResponse.json(
        { message: "The preferred date cannot be in the past." },
        { status: 400 }
      );
    }

    const service = await db.service.findFirst({
      where: {
        id: input.serviceId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!service) {
      return NextResponse.json(
        { message: "This service is unavailable. Please choose another." },
        { status: 404 }
      );
    }

    const bookingNumber = `SAMB-${Date.now()}-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const booking = await db.booking.create({
      data: {
        bookingNumber,
        customerId: session.user.id,
        serviceId: service.id,
        preferredDate,
        preferredTime: input.preferredTime,
        address: input.address,
        propertyType: input.propertyType || null,
        numberOfRooms: input.numberOfRooms ?? null,
        estimatedSize: input.estimatedSize || null,
        specialInstructions: input.specialInstructions || null,
        status: "PENDING",
      },
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        preferredDate: true,
        preferredTime: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Your service request has been submitted successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      { message: "Unable to submit your request right now. Please try again." },
      { status: 500 }
    );
  }
}
