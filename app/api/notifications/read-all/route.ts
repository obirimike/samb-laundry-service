import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Please sign in first." },
      { status: 401 }
    );
  }

  const result = await db.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json({
    success: true,
    updatedCount: result.count,
  });
}