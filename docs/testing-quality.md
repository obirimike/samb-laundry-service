# Testing & Quality Assurance

## Current automated checks

Run these checks before submitting a change:

```bash
npm run lint
npx tsc --noEmit
npm run test:e2e
npm run build
```

`npm run test:e2e` runs Playwright against the configured Chromium project. The web server configuration starts `npm run dev -- --port 3000`; tests may reuse an existing local server. The current E2E suite in `tests/e2e/public-pages.spec.ts` verifies selected public pages, the mobile login password-visibility control, and service detail navigation.

There are no quote-send-specific automated tests in the current E2E suite. Passing the existing suite therefore does not establish quote authorization, database state, notification, concurrency, or email-provider behavior.

## Quote-send verification checklist

Use a non-production database and a Resend test configuration. Verify:

1. Unauthenticated request returns `401`; an authenticated non-admin request returns `403`.
2. Unknown quote identifier returns `404`.
3. An unexpired `DRAFT` quote returns `200`, changes to `SENT`, sets `sentAt`, and creates one customer `QUOTE_SENT` notification.
4. An unexpired `SENT` quote can be resent; the status remains `SENT` and the first-send timestamp and notification are not duplicated.
5. An expired `DRAFT` or `SENT` quote returns `400`, becomes `EXPIRED`, and is not emailed.
6. A quote in `ACCEPTED`, `DECLINED`, `EXPIRED`, or `WITHDRAWN` status returns `409`.
7. Missing or rejected Resend configuration returns HTTP `200` with `emailSent: false`, and the admin UI explains that email delivery failed while the quote remains available in the customer's account.
8. A concurrent state transition cannot be overwritten by the first-send update; the request returns `409`.
9. The email includes the expected customer, booking, service, price breakdown, terms, expiry, and customer account URL.

For checks involving the real provider, use a controlled test recipient and verify delivery in Resend without sending messages to customers.

## Quality and reliability notes

- The state transition uses a conditional update to detect a concurrent change.
- First-send status and notification creation share a database transaction.
- Email delivery runs outside that transaction; test and communicate provider failure separately from database state.
- Keep test credentials and customer data out of committed files and test output.
- Do not use production records for exploratory testing.
