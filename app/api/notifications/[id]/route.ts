import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  _request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Please sign in first." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await db.notification.updateMany({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      isRead: true,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { message: "Notification not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}