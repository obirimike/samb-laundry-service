import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const rateLimiters = redis
  ? {
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 m"),
        prefix: "samb:auth",
        analytics: true,
        timeout: 1_000,
      }),
      registration: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "samb:registration",
        analytics: true,
        timeout: 1_000,
      }),
      contact: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "10 m"),
        prefix: "samb:contact",
        analytics: true,
        timeout: 1_000,
      }),
      booking: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 m"),
        prefix: "samb:booking",
        analytics: true,
        timeout: 1_000,
      }),
    }
  : null;

export type RateLimitPolicy = "auth" | "registration" | "contact" | "booking";

export function getRequestIdentifier(request: Request, suffix?: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  return suffix ? `${ip}:${suffix}` : ip;
}

export async function limitRequest(
  request: Request,
  policy: RateLimitPolicy,
  suffix?: string
) {
  if (!rateLimiters) return null;

  return rateLimiters[policy].limit(getRequestIdentifier(request, suffix));
}

export function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}) {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
    "Retry-After": String(Math.max(0, Math.ceil((result.reset - Date.now()) / 1000))),
  };
}
