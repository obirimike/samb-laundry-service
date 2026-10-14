export async function GET() {
  return Response.json({ ok: true, message: "Contact route is ready." });
}

import { NextResponse } from "next/server";
import { limitRequest, rateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimit = await limitRequest(request, "contact");

  if (rateLimit && !rateLimit.success) {
    return NextResponse.json(
      { message: "Too many contact requests. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }

  return Response.json({ ok: true, message: "Contact route is ready." });
}
