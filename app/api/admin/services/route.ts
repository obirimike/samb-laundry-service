
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const serviceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(["CLEANING", "LAUNDRY", "DOMESTIC_SUPPORT", "PEST_CONTROL"]),
  imageUrl: z.union([z.string().trim().url(), z.literal("")]).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
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

    const parsed = serviceSchema.safeParse(await request.json());

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
    const service = await db.service.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        category: input.category,
        imageUrl: input.imageUrl || null,
        isActive: input.isActive ?? true,
      },
    });

    return NextResponse.json(
      { message: "Service created successfully.", service },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "That service slug is already in use. Choose another." },
        { status: 409 }
      );
    }

    console.error("Create service error:", error);

    return NextResponse.json(
      { message: "Unable to create the service right now." },
      { status: 500 }
    );
  }
}
