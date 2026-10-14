# SAMB Laundry Platform

Next.js application for customer bookings, customer accounts, and administrator-managed services.

## Local setup

1. Copy `.env.example` to `.env` and replace every placeholder with local credentials.
2. Install dependencies with `npm ci`.
3. Generate Prisma Client with `npm run db:generate`.
4. Apply local migrations with `npm run db:migrate`.
5. Optionally seed development data with `npm run db:seed`.
6. Start the application with `npm run dev`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Required. |
| `AUTH_SECRET` | Long random secret used to sign authentication tokens. Required. |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in booking emails. Required in deployed environments. |
| `RESEND_API_KEY` | Resend API key for booking-status emails. Required to send email. |
| `EMAIL_FROM` | Verified sender identity for Resend emails. Required in production. |

Never commit `.env` or production secrets.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

Before deploying application code, configure production environment variables and run:

```bash
npm run db:generate
npm run db:migrate
npm run build
```

Run `db:migrate` once per release against the production database; do not use `prisma migrate dev` in production. Verify a backup and a rollback plan before applying migrations.
