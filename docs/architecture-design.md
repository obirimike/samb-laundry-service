# Architecture & Design Documentation

## Context

The quote-send feature is implemented as a Next.js App Router route handler at `app/api/admin/quotes/[id]/send/route.ts`. It runs on the Node.js runtime, uses the application's session helper for authentication, Prisma for PostgreSQL persistence, and the `sendQuoteEmail` helper for Resend delivery.

Related components:

- `app/api/admin/quotes/route.ts` creates and lists quotes.
- `app/api/admin/quotes/[id]/route.ts` supports other quote operations, including its own draft-send handler.
- `app/admin/quotes/page.tsx` loads the administrator quote-management UI.
- `components/admin/QuoteManagement.tsx` calls the send endpoint and refreshes the quote list.
- `app/account/quotes/page.tsx` provides customer quote data.
- `lib/emails.ts` renders and sends quote email.
- `lib/quotes.ts` expires sent quotes and creates expiry notifications.
- `prisma/schema.prisma` defines quote statuses, quote-booking relationships, and notifications.

## Send request flow

1. The route resolves the session and requires an authenticated user with role `ADMIN`.
2. It reads the quote and the related booking, customer, and service within a Prisma transaction.
3. It returns `404` for a missing quote and `409` if the current status is neither `DRAFT` nor `SENT`.
4. If the quote has expired, it marks the quote `EXPIRED` and returns `400`.
5. For a first send, it conditionally updates `DRAFT` to `SENT` and records `sentAt`. A conditional update prevents overwriting a concurrent status change. In the same transaction, it creates the customer's `QUOTE_SENT` notification.
6. After the database transaction commits, the route calls `sendQuoteEmail` with the customer and quote details.
7. It returns `200` with `emailSent` and a message reflecting delivery success or failure.

## Persistence and consistency

The database transaction protects the first-send state update and notification creation. Email delivery happens after that transaction and cannot be atomic with the PostgreSQL commit. Consequently, the quote can be `SENT` and visible in the customer's account even if Resend is unavailable. The endpoint explicitly reports this outcome as `emailSent: false`; administrators may retry because `SENT` quotes remain sendable.

Repeated sends do not transition the quote again or recreate the first-send notification. A conditional `updateMany` guards the `DRAFT` to `SENT` transition against concurrent modifications.

## Data model

`Quote` stores a unique quote number, booking and creator relations, decimal amount, currency, JSON breakdown, terms, status, optional expiry and send/response timestamps, and revision metadata. The default currency is `GHS`. A quote belongs to a booking; the route obtains the recipient email and service information through that booking.

`Notification` stores the first-send in-app notification for the customer. Notifications use the `QUOTE_SENT` type and reference the customer user.

## Runtime and errors

The route exports `runtime = "nodejs"` and `dynamic = "force-dynamic"`. Expected authorization, lookup, expiry, status, and concurrency outcomes return explicit JSON messages and HTTP statuses. Unexpected errors are logged server-side and returned as `500` with a generic message.

The admin client calls the route with a bodyless `POST`. For `200` responses, the client currently displays `message`; the `emailSent` field is provided in the API response for delivery-aware callers.

## Email boundary

`sendQuoteEmail` is the external-service boundary. It sends through Resend using `RESEND_API_KEY`, chooses `EMAIL_FROM` when configured, and links to the customer quote page using `NEXT_PUBLIC_APP_URL` (falling back to localhost for development). Email HTML values are escaped by the email helper.

## Design caveat

`app/api/admin/quotes/[id]/route.ts` also contains an older draft-send flow. It has different ordering and failure semantics from the dedicated `/send` route. The administrator UI uses the dedicated `/send` route. Keep these surfaces in mind when changing quote email behavior so they do not drift further.
