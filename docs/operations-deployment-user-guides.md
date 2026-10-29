# Operations, Deployment & User Guides

## Environment Configuration

Set these variables in your deployment platform's secret/configuration store. **Never commit values to the repository.**

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/samb`) |
| `AUTH_SECRET` | Yes | Secret for NextAuth JWT signing — generate a strong, unique value per environment |
| `NEXT_PUBLIC_APP_URL` | Yes (production) | Public HTTPS base URL (e.g. `https://samb.example.com`). Used in email links. Falls back to `http://localhost:3000` in development. |
| `RESEND_API_KEY` | For email delivery | Resend API key. Without it, the app functions normally but emails are not delivered (`emailSent: false`). |
| `EMAIL_FROM` | Recommended | Verified sender identity for Resend (e.g. `SAMB <noreply@samb.example.com>`). A development fallback is used if unset. |
| UPSTASH_REDIS_REST_URL | For rate limiting | Upstash Redis REST endpoint. Required in production; dev falls back to no rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | For rate limiting | Upstash Redis REST token. |

See `.env.example` for placeholder values. Do not copy placeholder values into production.

---

## Deployment Procedure

### Prerequisites

1. Provision a PostgreSQL 16 database.
2. Configure a [Resend](https://resend.com/) account with a valid API key and verified sender domain.
3. *(Optional)* Configure [Upstash Redis](https://upstash.com/) for rate limiting.
4. Set all required environment variables in the deployment platform.
5. Set `NEXT_PUBLIC_APP_URL` to the public HTTPS origin customers will use.
6. Ensure a database backup and rollback plan are in place before schema changes.

### Build & Deploy

```bash
npm ci                   # Install locked dependencies
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Apply committed migrations
npm run build            # Create production build
npm run start            # Start production server
```

### Post-Deployment Verification

1. ✅ Sign in with an administrator account.
2. ✅ Verify the admin dashboard loads with correct metrics.
3. ✅ Create or view a booking from the admin panel.
4. ✅ Send a quote email to a controlled test recipient.
5. ✅ Verify the customer quote page displays correctly.
6. ✅ Submit a test booking from the public booking form.
7. ✅ Verify email delivery in the Resend dashboard.
8. ✅ Verify the service catalogue loads with star ratings.

### Migration Safety

- Run `npm run db:migrate` (which uses `prisma migrate deploy`) **once per release**, before serving code that depends on the new schema.
- **Never** run `prisma migrate dev` against a production database.
- Always have a tested backup and rollback procedure before applying migrations.

---

## User Guides

### Administrator Guide

#### Managing Bookings

1. Sign in with an admin account and navigate to **Admin → Bookings** (`/admin/bookings`).
2. View all bookings with filters by status.
3. Click a booking to view full details including customer info, service, schedule, and special instructions.
4. Update booking status: `PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`, or cancel from any non-completed state.
5. Add admin notes for internal record-keeping.
6. Status changes automatically trigger email notifications to the customer.

#### Sending & Revising Quotes

1. Navigate to **Admin → Quotes** (`/admin/quotes`).
2. Create a new quote for a booking with itemised line items, optional terms, and optional expiry.
3. Select an existing draft quote and choose **Send**.
4. Confirm the send prompt and check the result:
   - ✅ Successful delivery: "Quote sent successfully."
   - ⚠️ Email failure: the quote is available in the customer's account, but the email was not delivered. Check Resend configuration and retry.
5. A quote in `SENT` status can be resent from the same interface.
6. To revise a quote: select the quote and choose **Revise**. Update line items, terms, or expiry. This creates a new draft revision linked to the predecessor.
   - If the predecessor was `SENT`, it is automatically changed to `WITHDRAWN` and the customer is notified.
7. An expired quote cannot be sent — create a revision instead.

#### Managing Staff

1. Navigate to **Admin → Staff** (`/admin/staff`).
2. Create new staff accounts with name, email, and password.
3. View all staff members and their details.

#### Assigning Staff to Bookings

1. Navigate to **Admin → Assignments** (`/admin/assignments`).
2. Select a booking and assign one or more staff members.
3. Add optional notes for the assignment.
4. Unassign staff when work is complete or reassignment is needed.

#### Moderating Reviews

1. Navigate to **Admin → Reviews** (`/admin/reviews`).
2. View all pending reviews with customer name, rating, comment, booking, and service details.
3. **Publish** a review to make it visible on the service page and included in aggregate ratings.
4. **Hide** a review to remove it from public view (with an optional moderation note).
5. Published reviews cannot be edited by the admin — only their visibility status can be changed.

#### Managing Services

1. Navigate to **Admin → Services** (`/admin/services`).
2. Create new services with name, description, category, slug, and optional image URL.
3. Edit existing service details.
4. Activate or deactivate services. Deactivated services are hidden from the public catalogue.

#### Viewing Contact Messages

1. Navigate to **Admin → Messages** (`/admin/messages`).
2. View all contact form submissions.
3. Update message status: `NEW` → `READ` → `RESOLVED`.

#### Viewing Customers

1. Navigate to **Admin → Customers** (`/admin/customers`).
2. Browse all registered customers.
3. Click a customer to view their profile, booking history, and activity.

### Customer Guide

#### Browsing Services

1. Visit the **Services** page (`/services`).
2. Filter services by category using the tabs: All, Cleaning, Laundry, Domestic Support, Pest Control.
3. View star ratings and review counts on each service card.
4. Click **Details** to see the full service description and published reviews.
5. Click **Book** to start a booking request.

#### Making a Booking

1. Visit the **Book** page (`/book`) or click **Book** on a service card.
2. Fill in: preferred date and time, address, property details, and any special instructions.
3. Submit the booking request. You'll receive a unique booking number.
4. Track your booking status from **Account → Bookings** (`/account/bookings`).
5. You'll receive email notifications as your booking progresses through each status.

#### Reviewing Quotes

1. When a quote is sent, you'll receive an email with a link to your account.
2. Sign in and navigate to **Account → Quotes** (`/account/quotes`).
3. Review the itemised breakdown, total amount, terms, and expiry date.
4. View revision history if the admin has revised the quote.
5. **Accept** or **Decline** the active quote. Only quotes in `SENT` status can be responded to.

#### Writing Reviews

1. After a booking is completed, navigate to **Account → Bookings** (`/account/bookings`).
2. Open the completed booking and submit a review with a star rating (1–5) and optional comment.
3. Your review will be visible on the service page after admin moderation.

#### Managing Notifications

1. Navigate to **Account → Notifications** (`/account/notifications`).
2. View notifications about quote activity, booking status changes, and more.
3. Mark individual notifications as read, or use **Mark all as read**.

---

## Troubleshooting

### Quote Email Not Delivered

1. Confirm `RESEND_API_KEY` is set in the running application environment and restart/redeploy if values were changed.
2. Confirm `EMAIL_FROM` is a sender/domain verified in the Resend account.
3. Confirm `NEXT_PUBLIC_APP_URL` is the public HTTPS origin (otherwise the email link points to localhost).
4. Check application logs for the specific provider or configuration error. Do not expose API keys or customer information when collecting logs.
5. Check [Resend's dashboard](https://resend.com/) for delivery activity and sending limits.
6. Retry from `/admin/quotes` after confirming the quote status, since resending dispatches another email.

> **Important:** The endpoint persists the first-send transition and customer notification *before* attempting email delivery. A failed email can coexist with `SENT` status. The `emailSent` field in the API response (not the quote status) is the source of truth for delivery.

### Booking Status Email Not Delivered

1. Follow the same Resend configuration checks as for quote emails.
2. Verify the customer's email address is correct in their profile.
3. Check application logs for the specific error.

### Rate Limiting Issues

1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set correctly.
2. In development, rate limiting is skipped if Upstash variables are omitted. In production, missing variables will cause request endpoints using rate limiting to throw an error.
3. Rate limit policies: auth (10/10min), registration (5/10min), contact (3/10min), booking (10/10min).

### Database Connection Errors

1. Verify `DATABASE_URL` is correct and the PostgreSQL instance is reachable.
2. Ensure migrations have been applied: `npm run db:migrate`.
3. Check that the Prisma Client was generated: `npm run db:generate`.

---

## Operational Safety

- **Monitor** application errors (Sentry) and email delivery outcomes (Resend dashboard).
- **Protect** production secrets and restrict database access to the application and authorised operators.
- **Back up** the database before migrations and verify restore procedures periodically.
- **Use test accounts** and controlled recipients for operational checks — never use production customer data for testing.
- **Do not assume** a quote's `SENT` status guarantees successful email delivery; always check the `emailSent` field and Resend delivery records.
- **Rotate** `AUTH_SECRET` and API keys according to your security policy; redeploy after rotation.
