# Testing & Quality Assurance

## Automated Quality Checks

Run the full suite before submitting any change:

```bash
npm run lint          # ESLint (Next.js core-web-vitals + TypeScript rules)
npx tsc --noEmit      # TypeScript strict type checking
npm run test:e2e      # Playwright end-to-end tests
npm run build         # Next.js production build
```

These checks are enforced in CI via GitHub Actions (`.github/workflows/ci.yml`) on all pull requests and pushes to `main`, running on Node.js 22.

## E2E Test Suite

### Configuration

- **Framework:** Playwright (`@playwright/test` ^1.64)
- **Browser:** Chromium (Desktop Chrome)
- **Base URL:** `http://127.0.0.1:3000`
- **Web Server:** `npm run dev -- --port 3000` (auto-started with 120s timeout)
- **Parallelism:** Fully parallel test execution
- **Test directory:** `tests/e2e/`

### Current Coverage

The E2E suite (`tests/e2e/public-pages.spec.ts`) covers:

| Area | Tests |
| --- | --- |
| Public pages | Selected public page renders and navigation |
| Mobile login | Password visibility toggle interaction |
| Service navigation | Service detail page access from catalogue |

### Coverage Gaps

The following areas do not currently have automated E2E coverage:

- Quote creation, send, resend, revision, and expiry workflows
- Quote authorisation (admin-only access)
- Booking creation and status transition flows
- Staff assignment management
- Customer review submission and admin moderation
- Notification creation and display
- Contact form submission
- Registration flow
- Rate limiting behaviour
- Concurrent modification handling

These should be verified manually using the checklists below, or through future test additions.

## Manual Verification Checklists

### Quote Send Verification

Use a non-production database and a Resend test configuration. Verify:

1. Unauthenticated request returns `401`; authenticated non-admin returns `403`.
2. Unknown quote identifier returns `404`.
3. An unexpired `DRAFT` quote returns `200`, changes to `SENT`, sets `sentAt`, and creates one customer `QUOTE_SENT` notification.
4. An unexpired `SENT` quote can be resent; status remains `SENT`, first-send timestamp and notification are not duplicated.
5. An expired `DRAFT` or `SENT` quote returns `400`, becomes `EXPIRED`, and is not emailed.
6. A quote in `ACCEPTED`, `DECLINED`, `EXPIRED`, or `WITHDRAWN` status returns `409`.
7. Missing or rejected Resend configuration returns `200` with `emailSent: false`, and the admin UI explains the delivery failure.
8. A concurrent state transition returns `409` and cannot overwrite the first-send update.
9. The email includes: customer name, booking/quote numbers, service name, price breakdown, terms, expiry, and account URL.

### Booking Workflow Verification

1. Guest visitor can submit a booking request for an active service.
2. Authenticated customer can submit a booking request.
3. Booking receives a unique booking number.
4. Admin can update booking status through each transition: `PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`.
5. Admin can cancel a booking from any non-completed state.
6. Each status change sends an email notification to the customer.
7. Customer can view their bookings and status updates from `/account/bookings`.
8. Rate limiting prevents excessive booking submissions.

### Review Moderation Verification

1. Customer can submit a review (rating + optional comment) for a completed booking.
2. Customer cannot submit multiple reviews for the same booking.
3. New review defaults to `PENDING` status and does not appear publicly.
4. Admin can publish a review from `/admin/reviews`.
5. Admin can hide a review and add a moderation note.
6. Published reviews appear on the service detail page.
7. Aggregate star rating on service cards reflects only published reviews.
8. Services without published reviews show "No reviews yet".

### Staff Assignment Verification

1. Admin can assign staff to a booking.
2. Admin can assign multiple staff to the same booking.
3. Admin can unassign staff from a booking.
4. Assignment/unassignment records the admin who performed the action.
5. Staff can view their active assignments from `/staff`.

### Contact Form Verification

1. Visitor can submit a contact message.
2. Submission is rate-limited (3 per 10 min per IP).
3. Admin can view and manage contact messages from `/admin/messages`.

## Quality & Reliability Notes

- **Conditional updates** — State transitions use conditional `updateMany` to detect concurrent changes, preventing race conditions.
- **Transaction boundaries** — First-send status + notification creation share a database transaction. Email delivery runs outside this transaction.
- **Email delivery is fallible** — Test and communicate provider failure separately from database state. The `emailSent` field is the source of truth, not the quote's `SENT` status.
- **Test isolation** — Keep test credentials and customer data out of committed files and test output. Use test-specific database instances or transactions.
- **Production data** — Never use production records for exploratory testing.
- **Resend testing** — For checks involving the real email provider, use a controlled test recipient and verify delivery in the Resend dashboard.
