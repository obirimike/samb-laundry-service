
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendBookingStatusEmail } from "@/lib/emails";

const updateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]).optional(),
  adminNotes: z.string().max(3000).nullable().optional(),
}).refine(
  (data) => data.status !== undefined || data.adminNotes !== undefined,
  { message: "Provide a status or administrator note to update." }
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function getBookingNotification(status: string, bookingNumber: string) {
  switch (status) {
    case "CONFIRMED":
      return {
        title: "Booking confirmed",
        message: `Your booking ${bookingNumber} has been confirmed. We look forward to serving you.`,
      };

    case "IN_PROGRESS":
      return {
        title: "Service in progress",
        message: `Work on your booking ${bookingNumber} has started.`,
      };

    case "COMPLETED":
      return {
        title: "Service completed",
        message: `Your booking ${bookingNumber} has been marked as completed. Thank you for choosing SAMB's Laundry and Klinin Services.`,
      };

    case "CANCELLED":
      return {
        title: "Booking cancelled",
        message: `Your booking ${bookingNumber} has been cancelled. Please contact us if you need assistance.`,
      };

    default:
      return null;
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please sign in." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Administrator access is required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid update details.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing = await db.booking.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    const { status, adminNotes } = parsed.data;

    if (
      status &&
      status !== existing.status &&
      !allowedTransitions[existing.status]?.includes(status)
    ) {
      return NextResponse.json(
        {
          message: `The booking cannot move from ${existing.status} to ${status}.`,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const data: {
      status?: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      adminNotes?: string | null;
      confirmedAt?: Date | null;
      completedAt?: Date | null;
      cancelledAt?: Date | null;
    } = {};

    if (status !== undefined) {
      data.status = status;

      if (status === "CONFIRMED") data.confirmedAt = now;
      if (status === "COMPLETED") data.completedAt = now;
      if (status === "CANCELLED") data.cancelledAt = now;
    }

    if (adminNotes !== undefined) {
      data.adminNotes = adminNotes?.trim() || null;
    }

    const updated = await db.booking.update({
      where: { id },
      data,
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        customerId: true,
        updatedAt: true,
      },
    });

    if (status && status !== existing.status) {
      const notification = getBookingNotification(
        updated.status,
        updated.bookingNumber
      );

      if (notification) {
        try {
          await db.notification.create({
            data: {
              userId: updated.customerId,
              title: notification.title,
              message: notification.message,
              type: "BOOKING_UPDATE",
            },
          });
        } catch (error) {
          console.error("Failed to create booking notification:", error);
        }
      }

      try {
        const customer = await db.user.findUnique({
          where: { id: updated.customerId },
          select: { name: true, email: true },
        });

        if (customer) {
          const emailResult = await sendBookingStatusEmail({
            to: customer.email,
            customerName: customer.name,
            bookingNumber: updated.bookingNumber,
            status: updated.status,
          });

          if (!emailResult.success) {
            console.error(
              `Email notification was not sent for booking ${updated.bookingNumber}.`
            );
          }
        }
      } catch (error) {
        console.error("Failed to send booking status email:", error);
      }
    }

    return NextResponse.json({
      message: "Booking updated successfully.",
      booking: updated,
    });
  } catch (error) {
    console.error("Admin booking update error:", error);

    return NextResponse.json(
      { message: "Unable to update this booking right now." },
      { status: 500 }
    );
  }
}
