# Operations, Deployment & User Guides

## Configuration

Set these environment variables in the deployment platform. Keep values in its secret/configuration store and never commit them.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `AUTH_SECRET` | Yes | Secret used by authentication; generate a strong, unique value per environment. |
| `NEXT_PUBLIC_APP_URL` | Yes in deployed environments | Public application base URL used to build the quote-account link in email. The email helper falls back to `http://localhost:3000` when unset, which is not appropriate for production. |
| `RESEND_API_KEY` | To deliver email | Resend API key. Without it, the quote endpoint reports `emailSent: false`. |
| `EMAIL_FROM` | Recommended; use verified sender in production | Sender identity for Resend. The email helper has a development-oriented fallback; configure a sender verified for the production Resend account. |
| `UPSTASH_REDIS_REST_URL` | When using the configured Redis-backed features | Upstash Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | When using the configured Redis-backed features | Upstash Redis REST token. |

See `.env.example` for placeholder values. Do not copy placeholder values into production.

## Deployment procedure

1. Provision PostgreSQL and configure the production environment variables.
2. Configure Resend with a valid API key and verified sender identity. Set `NEXT_PUBLIC_APP_URL` to the HTTPS origin customers use.
3. Ensure a database backup and rollback plan are available before schema changes.
4. Deploy the application version and run:

   ```bash
   npm ci
   npm run db:generate
   npm run db:migrate
   npm run build
   ```

5. Start the production server with `npm run start` using the platform's configured port and environment.
6. Verify sign-in, admin quote management, quote email delivery to a controlled recipient, and the customer quote page.

Run `db:migrate` once per release against production. Do not run `prisma migrate dev` against production. Apply migrations in the release process before serving code that requires the new schema.

## Administrator: send or resend a quote

1. Sign in with an administrator account and open the quote-management page at `/admin/quotes`.
2. Select an existing draft quote and choose the send action.
3. Confirm the send prompt.
4. Check the displayed result:
   - A successful delivery reports that the quote was sent.
   - If email delivery fails, the quote remains available in the customer's account, but the email was not sent. Check Resend configuration and retry the quote while its status remains `SENT`.
5. A quote already in `SENT` status can be sent again from the same interface.

An expired quote cannot be sent. The send request marks it `EXPIRED`; update the quote or create a new one using the available quote-management workflow.

## Customer: review a quote

Customers can sign in and open `/account/quotes` to review quotes associated with their bookings. The email includes this link. Quote email delivery does not itself confirm the booking or record payment; customers should follow the response actions presented in their account.

## Troubleshooting quote email

1. Confirm `RESEND_API_KEY` is set in the running application environment and restart/redeploy if environment values changed.
2. Confirm `EMAIL_FROM` is a sender/domain verified in the Resend account and that the recipient address is correct.
3. Confirm `NEXT_PUBLIC_APP_URL` is the public HTTPS origin; otherwise the email link can point to localhost.
4. Check application logs for the provider/configuration error. Do not expose API keys or customer information when collecting logs.
5. Check Resend's delivery activity and sending limits.
6. Retry from `/admin/quotes` only after checking the quote status and delivery history, since resending may send another email.

The endpoint persists a first-send transition and customer notification before attempting email delivery. Therefore, a failed email can coexist with `SENT` status. Its response includes `emailSent: false`; status alone is not proof of delivery. The API may also return `500` for unexpected application errors; inspect server logs and retry only after checking whether a prior attempt delivered.

## Operations and safety

- Monitor application errors and Resend delivery outcomes.
- Protect production secrets and restrict database access to the application and authorized operators.
- Back up the database before migrations and verify restore procedures periodically.
- Use test accounts and controlled recipients for operational checks.
- Do not assume a quote's `SENT` status guarantees successful email delivery; use the send result and provider records.
