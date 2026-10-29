# Development & Code Documentation

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS (with Turbopack) | 4.x |
| Database | PostgreSQL | 16 |
| ORM | Prisma (`@prisma/adapter-pg` driver adapter) | 7.x |
| Authentication | NextAuth (Credentials provider, JWT sessions) | 5.x (beta) |
| Email | Resend | 6.x |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`) | 2.x |
| Validation | Zod | 4.x |
| Icons | Lucide React | 1.x |
| Error Tracking | Sentry (`@sentry/node`) | 11.x |
| E2E Testing | Playwright | 1.x |
| CI/CD | GitHub Actions | — |
| Containerisation | Docker Compose (PostgreSQL) | — |

Exact package versions and scripts are maintained in `package.json` and the lockfile.

## Local Setup

### Prerequisites

- Node.js ≥ 22 with npm
- PostgreSQL 16 (local install or Docker)

### Steps

1. Clone the repository and `cd` into the project directory.
2. Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL` — local PostgreSQL connection string
   - `AUTH_SECRET` — a strong secret for JWT signing (any random string for local dev)
   - Other variables are optional for local development (see [Operations docs](operations-deployment-user-guides.md))
3. Install locked dependencies:
   ```bash
   npm ci
   ```
4. Start PostgreSQL (if using Docker):
   ```bash
   docker compose up -d
   ```
5. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```
6. Apply all migrations:
   ```bash
   npm run db:migrate
   ```
7. Seed development data (optional — creates 20 services):
   ```bash
   npm run db:seed
   ```
8. Start the dev server:
   ```bash
   npm run dev
   ```

The application is served at `http://localhost:3000`. The dev server uses Turbopack for fast hot-module replacement.

> **Note:** `npm run db:migrate` uses `prisma migrate deploy`. Use the repository's established migration workflow when authoring new migrations. Never run `prisma migrate dev` against production.

## Code Map

### Core Application Code

| Concern | Location |
| --- | --- |
| **App routes & pages** | `app/` (30 pages across 5 route groups) |
| **API route handlers** | `app/api/` (21 endpoints) |
| **React components** | `components/` (8 subdirectories) |
| **Server utilities** | `lib/` (9 files) |
| **Type declarations** | `types/` |
| **Database schema** | `prisma/schema.prisma` |
| **Migrations** | `prisma/migrations/` (5 migrations) |
| **Seed script** | `prisma/seed.ts` |
| **E2E tests** | `tests/e2e/` |
| **Static assets** | `public/images/` |

### Key Library Files

| File | Purpose |
| --- | --- |
| `lib/auth.ts` | NextAuth initialisation with Credentials provider and bcryptjs password verification |
| `lib/auth.config.ts` | JWT strategy, custom sign-in page, JWT/session callbacks |
| `lib/db.ts` | Prisma Client singleton with PrismaPg driver adapter and hot-reload support |
| `lib/emails.ts` | Email templates for booking status, quote send, and quote response (HTML + plain text via Resend) |
| `lib/quotes.ts` | Batch quote expiry processing with transaction-safe updates and notification creation |
| `lib/rate-limit.ts` | Upstash Redis rate-limiting with 4 policies (auth, registration, contact, booking) |
| `lib/require-admin.ts` | Helper to validate admin role from session |
| `lib/service-types.ts` | `ServiceWithRatings` type extending Prisma Service model |
| `lib/services-data.ts` | Static service images (Unsplash), highlights, and category-based fallbacks |

### Component Organisation

| Directory | Components | Purpose |
| --- | --- | --- |
| `components/account/` | `CustomerQuotes`, `ReviewForm` | Customer account features |
| `components/admin/` | `AdminNavigation`, `AssignmentManagement`, `BookingCalendar`, `BookingManager`, `QuoteManagement`, `ReviewModerationList`, `ServiceManager`, `StaffManagement` | Admin dashboard |
| `components/auth/` | `SignOutButton`, `SignOutMessage` | Authentication UI |
| `components/booking/` | `BookingForm` | Booking request form |
| `components/dashboard/` | `NotificationsList` | Dashboard widgets |
| `components/layout/` | `NavBar`, `Footer` | Shared layout |
| `components/services/` | `ServiceCard`, `ServiceGrid`, `ServiceIcon`, `PublishedReviews`, skeletons | Service catalogue display |
| `components/ui/` | `Skeleton` | Shared UI primitives |

### Admin Feature Map

| Feature | Page | Component | API Endpoint(s) |
| --- | --- | --- | --- |
| Bookings | `app/admin/bookings/` | `BookingManager` | `PATCH /api/admin/bookings/[id]` |
| Quotes | `app/admin/quotes/` | `QuoteManagement` | `POST /api/admin/quotes`, `POST .../[id]/send`, `POST .../[id]/revise` |
| Staff | `app/admin/staff/` | `StaffManagement` | `POST /api/admin/staff` |
| Assignments | `app/admin/assignments/` | `AssignmentManagement` | `POST /api/admin/bookings/[id]/assignments` |
| Reviews | `app/admin/reviews/` | `ReviewModerationList` | `PATCH /api/admin/reviews` |
| Services | `app/admin/services/` | `ServiceManager` | `POST /api/admin/services`, `PATCH /api/admin/services/[id]` |
| Customers | `app/admin/customers/` | — (server component) | — (direct Prisma queries) |
| Messages | `app/admin/messages/` | — (server component) | — (direct Prisma queries) |
| Calendar | `app/admin/calendar/` | `BookingCalendar` | — (direct Prisma queries) |

## Implementation Conventions

1. **Authorisation is server-side only** — All access control lives in route handlers. Hiding UI controls is cosmetic, not a security boundary.
2. **Conditional updates for state transitions** — Use `updateMany` with a `where` clause on the current status to prevent race conditions on concurrent modifications.
3. **Transaction boundaries** — Group related state changes and notification creation in a single Prisma transaction.
4. **Fallible external services** — Treat email delivery as fallible. Always report the delivery result explicitly to the caller (`emailSent` field).
5. **Input validation** — Use Zod schemas for all API input validation. Return structured error messages.
6. **No secrets in responses** — Never log secrets or expose provider credentials in API responses.
7. **HTML escaping** — All dynamic values in email templates are escaped via `escapeHtml()`.
8. **Prisma enum alignment** — When modifying status enums, update the Prisma schema, all route handlers, UI components, and documentation together.

## Useful Commands

```bash
# Development
npm run dev                # Start dev server (Turbopack)

# Quality
npm run lint               # ESLint
npx tsc --noEmit           # TypeScript type check
npm run test:e2e           # Playwright E2E tests
npm run build              # Production build

# Database
npm run db:generate        # Generate Prisma Client
npm run db:migrate         # Apply migrations (prisma migrate deploy)
npm run db:seed            # Seed services data
```

## Change Checklists

### Adding a New Feature

- [ ] Add/update Prisma models and create a migration
- [ ] Add API route handler(s) with proper auth checks
- [ ] Add/update React components
- [ ] Add/update page(s) in the appropriate route group
- [ ] Add input validation with Zod
- [ ] Update TypeScript types if shared across components
- [ ] Add loading states (`loading.tsx`) for new pages
- [ ] Run full quality suite: lint, tsc, e2e, build
- [ ] Update documentation

### Modifying Quote Behaviour

- [ ] Review API behaviour in both `/send` and `/quotes/[id]` routes
- [ ] Update admin UI messaging in `QuoteManagement`
- [ ] Update customer notifications
- [ ] Update email content in `lib/emails.ts`
- [ ] Verify quote expiry logic in `lib/quotes.ts`
- [ ] Check database migrations if schema changes
- [ ] Run tests and verify manually

### Modifying Booking Status Transitions

- [ ] Update allowed transitions in the booking API handler
- [ ] Update email templates in `lib/emails.ts`
- [ ] Update the `BookingStatus` enum if adding new statuses
- [ ] Verify the admin booking management UI
- [ ] Verify the customer booking view
- [ ] Check notification creation
