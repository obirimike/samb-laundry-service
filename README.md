# SAMB's Laundry & Klinin Services Platform

A full-stack service-management platform built for **SAMB's Laundry and Klinin Services** — a Ghana-based business offering professional cleaning, laundry care, domestic support, and pest control. The application handles public service browsing, customer bookings, administrator quoting and scheduling, staff assignments, customer reviews, and transactional email delivery.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Authentication](#authentication)
- [Documentation](#documentation)
- [Quality Checks](#quality-checks)
- [Deployment](#deployment)
- [License](#license)

## Features

### Public

- **Service catalogue** — Browse 20+ services across four categories (Cleaning, Laundry, Domestic Support, Pest Control) with image cards, star ratings, and highlights.
- **Service detail pages** — Dynamic `/services/[slug]` pages with published customer reviews.
- **Booking requests** — Guests or logged-in customers can request a booking for any active service.
- **Contact form** — Public contact page with rate-limited message submission.
- **Informational pages** — About, How It Works.

### Customer Account (`/account`)

- **Dashboard** — Overview of bookings, quotes, and notifications.
- **Booking management** — View booking history, status updates, and individual booking details.
- **Quotes** — Review received quotes, view revision history, accept or decline active quotes.
- **Reviews** — Submit reviews for completed bookings.
- **Profile** — Account profile management.
- **Notifications** — In-app notifications for quote activity, booking status changes, and more.

### Admin Dashboard (`/admin`)

- **Dashboard** — At-a-glance metrics and activity.
- **Booking management** — View, filter, and update bookings; change statuses and add admin notes.
- **Quote workflow** — Create itemized quotes, revise with full revision history, send via email, and track customer responses.
- **Staff management** — Create and manage staff accounts.
- **Staff assignments** — Assign and unassign staff to bookings.
- **Calendar view** — Visual booking calendar.
- **Customer directory** — Browse and view customer profiles.
- **Service management** — CRUD operations on services (create, edit, activate/deactivate).
- **Review moderation** — Publish, hide, or add moderation notes to customer reviews.
- **Contact messages** — View and manage incoming contact form submissions.

### Staff (`/staff`)

- **Staff portal** — View assigned work.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (with Turbopack) |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 (`@prisma/adapter-pg` driver adapter) |
| Authentication | NextAuth v5 (Credentials provider, JWT sessions) |
| Email | [Resend](https://resend.com/) (transactional email) |
| Rate Limiting | [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`) |
| Validation | Zod 4 |
| Icons | Lucide React |
| Error Tracking | Sentry |
| E2E Testing | Playwright |
| CI/CD | GitHub Actions |
| Containerisation | Docker Compose (PostgreSQL) |

## Project Structure

```
samb-laundry-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   #   Auth pages (login, register)
│   ├── (public)/                 #   Public pages with NavBar + Footer layout
│   │   ├── services/             #     Service catalogue & detail pages
│   │   ├── book/                 #     Public booking form
│   │   ├── contact/              #     Contact form
│   │   ├── about/                #     About page
│   │   └── how-it-works/         #     How It Works page
│   ├── account/                  #   Customer dashboard & account pages
│   ├── admin/                    #   Admin dashboard & management pages
│   ├── staff/                    #   Staff portal
│   └── api/                      #   API route handlers (21 endpoints)
├── components/                   # React components
│   ├── account/                  #   Customer account components
│   ├── admin/                    #   Admin management components
│   ├── auth/                     #   Auth-related components
│   ├── booking/                  #   Booking form
│   ├── dashboard/                #   Dashboard widgets
│   ├── layout/                   #   NavBar, Footer
│   ├── services/                 #   Service cards, grid, reviews
│   └── ui/                       #   Shared UI primitives
├── lib/                          # Utilities & server-side logic
│   ├── auth.ts                   #   NextAuth configuration
│   ├── db.ts                     #   Prisma client singleton
│   ├── emails.ts                 #   Email templates (booking, quote, review)
│   ├── quotes.ts                 #   Quote expiry processing
│   ├── rate-limit.ts             #   Upstash rate-limiting policies
│   └── services-data.ts          #   Static service images & highlights
├── prisma/                       # Database schema, migrations & seed
├── tests/e2e/                    # Playwright end-to-end tests
├── types/                        # TypeScript type declarations
├── docs/                         # Detailed documentation
└── public/images/                # Static assets (logos, service SVGs)
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 22 and **npm**
- **PostgreSQL 16** — run locally or use the included Docker Compose file
- *(Optional)* [Resend](https://resend.com/) account for email delivery
- *(Optional)* [Upstash Redis](https://upstash.com/) for rate limiting

### 1. Clone & install

```bash
git clone <repository-url>
cd samb-laundry-platform
npm ci
```

### 2. Start PostgreSQL

Using Docker Compose:

```bash
docker compose up -d
```

Or point `DATABASE_URL` to an existing PostgreSQL 16 instance.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local values. See [Environment Variables](#environment-variables) for details.

### 4. Set up the database

```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Apply all migrations
npm run db:seed        # Seed 20 services across 4 categories (optional)
```

### 5. Start development server

```bash
npm run dev
```

The application is served at **http://localhost:3000**.

## Environment Variables

Copy `.env.example` and set each value. **Never commit `.env` or production secrets.**

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/samb`) |
| `AUTH_SECRET` | Yes | Secret for NextAuth JWT signing — generate a strong unique value per environment |
| `NEXT_PUBLIC_APP_URL` | Production | Public base URL (e.g. `https://samb.example.com`) — used in email links; defaults to `http://localhost:3000` in development |
| `RESEND_API_KEY` | For email | Resend API key — without it, the app functions but emails are not delivered |
| `EMAIL_FROM` | Recommended | Verified sender identity for Resend (e.g. `SAMB <noreply@samb.example.com>`) |
| `UPSTASH_REDIS_REST_URL` | For rate limiting | Upstash Redis REST endpoint � required in production; skipped in dev if unset |
| `UPSTASH_REDIS_REST_TOKEN` | For rate limiting | Upstash Redis REST token |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply database migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed the database with services |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Database

### Schema overview

The database has **8 models** and **6 enums**:

- **User** — Customers, admins, and staff with role-based access (`CUSTOMER`, `ADMIN`, `STAFF`).
- **Service** — Catalogue entries across four categories: Cleaning, Laundry, Domestic Support, Pest Control.
- **Booking** — Customer service requests with status lifecycle (`PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`).
- **Quote** — Itemized price quotes linked to bookings, supporting revision chains, expiry, and customer response (`DRAFT` → `SENT` → `ACCEPTED` / `DECLINED` / `EXPIRED` / `WITHDRAWN`).
- **BookingAssignment** — Staff-to-booking assignments with assignment/unassignment tracking.
- **Review** — Customer reviews with moderation workflow (`PENDING` → `PUBLISHED` / `HIDDEN`).
- **Notification** — In-app notifications for quote, booking, and review events.
- **ContactMessage** — Public contact form submissions (`NEW` → `READ` → `RESOLVED`).

### Migrations

Migrations are managed with Prisma Migrate. Use `npm run db:migrate` (which runs `prisma migrate deploy`) for both development and production. **Never** run `prisma migrate dev` against a production database.

## Authentication

Authentication uses **NextAuth v5** (beta) with a **Credentials provider** (email + password) and **JWT session strategy**.

- Passwords are hashed with `bcryptjs`.
- Sessions carry the user's `id` and `role` via JWT callbacks.
- Rate limiting on the login endpoint is enforced via Upstash Redis (10 requests per 10 minutes per IP).
- Admin-only API routes verify the `ADMIN` role server-side using `requireAdmin()`.

### Default roles

| Role | Access |
| --- | --- |
| `CUSTOMER` | Public pages, `/account/*`, booking/review/quote response APIs |
| `ADMIN` | Everything above + `/admin/*` and all admin API routes |
| `STAFF` | `/staff/*` and assigned work |

## Documentation

Detailed documentation is maintained in the `docs/` directory:

| Document | Description |
| --- | --- |
| [Requirements & Product](docs/requirements-product.md) | Feature specifications, functional requirements, user workflows, API contracts, and acceptance criteria |
| [Architecture & Design](docs/architecture-design.md) | System architecture, request flows, data model design, persistence strategy, and integration boundaries |
| [Development & Code](docs/development-code.md) | Technology stack, local setup, code map, implementation conventions, and change checklists |
| [Testing & Quality](docs/testing-quality.md) | Automated checks, E2E test coverage, manual verification checklists, and quality guidelines |
| [Operations & Deployment](docs/operations-deployment-user-guides.md) | Environment configuration, deployment procedure, admin/customer user guides, and troubleshooting |

## Quality Checks

Run the full quality suite before submitting changes:

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript type checking
npm run test:e2e      # Playwright E2E tests (requires running dev server)
npm run build         # Production build
```

These checks are also enforced in CI via GitHub Actions on pull requests and pushes to `main`.

## Deployment

### Production deployment

1. Provision a PostgreSQL 16 database and configure all [environment variables](#environment-variables).
2. Configure Resend with a valid API key and verified sender domain.
3. Set `NEXT_PUBLIC_APP_URL` to the public HTTPS origin.
4. Ensure a database backup and rollback plan are in place.
5. Build and deploy:

   ```bash
   npm ci
   npm run db:generate
   npm run db:migrate
   npm run build
   npm run start
   ```

6. Verify: sign-in, admin dashboard, booking creation, quote email delivery to a test recipient, and customer account access.

> **Important:** Run `db:migrate` once per release. Apply migrations before serving code that depends on the new schema. Never run `prisma migrate dev` in production.

### CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs lint, type checking, build, and E2E tests on Node.js 22 for all PRs and pushes to `main`.

## License

Private — not licensed for redistribution.
