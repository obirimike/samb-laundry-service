
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  category: z.enum(["CLEANING", "LAUNDRY", "DOMESTIC_SUPPORT", "PEST_CONTROL"]).optional(),
  imageUrl: z.union([z.string().trim().url(), z.literal("")]).nullable().optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update.",
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Please sign in." }, { status: 401 });
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
          message: "Please check the service details.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const existing = await db.service.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { message: "Service not found." },
        { status: 404 }
      );
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...input,
        ...(input.imageUrl !== undefined
          ? { imageUrl: input.imageUrl || null }
          : {}),
      },
    });

    return NextResponse.json({
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "That service slug is already in use." },
        { status: 409 }
      );
    }

    console.error("Update service error:", error);

    return NextResponse.json(
      { message: "Unable to update the service right now." },
      { status: 500 }
    );
  }
}
