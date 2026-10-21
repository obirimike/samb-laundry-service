# Development & Code Documentation

## Stack

- Next.js App Router and React
- TypeScript
- PostgreSQL with Prisma ORM
- NextAuth for authentication and role-bearing sessions
- Resend for transactional email
- Playwright for end-to-end browser tests
- ESLint for lint checks

Exact package versions and scripts are maintained in `package.json` and the lockfile.

## Local setup

1. Install a supported Node.js runtime and npm.
2. Copy `.env.example` to `.env`; set a local PostgreSQL `DATABASE_URL` and a strong local `AUTH_SECRET`.
3. Install the locked dependencies: `npm ci`.
4. Generate the Prisma client: `npm run db:generate`.
5. Apply migrations to the configured development database: `npm run db:migrate`.
6. Optionally seed the database: `npm run db:seed`.
7. Start Next.js: `npm run dev`.

The application is served locally at `http://localhost:3000`. `npm run db:migrate` uses Prisma's deploy migration flow; use the repository's established development migration workflow when authoring a new schema migration, and never use a development migration command against production.

## Quote workflow code map

| Concern | Location |
| --- | --- |
| Dedicated send endpoint | `app/api/admin/quotes/[id]/send/route.ts` |
| Quote revision endpoint | `app/api/admin/quotes/[id]/revise/route.ts` |
| Quote creation and list API | `app/api/admin/quotes/route.ts` |
| Quote management UI | `components/admin/QuoteManagement.tsx` |
| Quote email rendering and Resend call | `lib/emails.ts` |
| Quote model, relations, and states | `prisma/schema.prisma` |
| Sent quote expiry and notifications | `lib/quotes.ts` |
| Administrator quote page | `app/admin/quotes/page.tsx` |
| Customer quote page | `app/account/quotes/page.tsx` |

## Implementation conventions

- Keep authorization checks in server-side route handlers; hiding UI controls is not an authorization boundary.
- Use conditional database updates for state transitions that may race.
- Preserve the transaction boundary around the first-send status change and notification creation.
- Treat external email delivery as fallible and keep the delivery result explicit to the caller.
- Validate and document changes to quote statuses against the Prisma enum and all administrator/customer surfaces.
- Never log secrets or expose provider credentials in API responses.

## Useful commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run test:e2e
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Change checklist

For a change to quote sending, review API behavior, admin UI messaging, customer notifications, email content, quote expiry, database migrations, and tests. Keep the dedicated send endpoint and the send behavior in `app/api/admin/quotes/[id]/route.ts` aligned where they provide overlapping functionality.
