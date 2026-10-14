import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { limitRequest, rateLimitHeaders } from "./lib/rate-limit";

const { auth } = NextAuth(authConfig);

export default auth(async function proxy(request) {
  if (
    request.method === "POST" &&
    request.url.includes("/api/auth/callback/credentials")
  ) {
    const rateLimit = await limitRequest(request, "auth");

    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { message: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rateLimit) }
      );
    }
  }

  return NextResponse.next();
});
