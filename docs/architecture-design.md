# Architecture & Design Documentation

## System Overview

SAMB is a monolithic Next.js 16 application using the App Router pattern. It serves server-rendered pages, client-interactive components, and REST API endpoints from a single deployment. All data is persisted in PostgreSQL via Prisma ORM, authentication is handled by NextAuth v5, and transactional email is delivered through Resend.

```text
┌─────────────────────────────────────────────────────┐
│                    Next.js App                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Public   │  │   Customer   │  │    Admin     │  │
│  │  Pages    │  │   Account    │  │  Dashboard   │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
│       │               │                 │           │
│  ┌────┴───────────────┴─────────────────┴────────┐  │
│  │              API Route Handlers               │  │
│  │         (21 endpoints, role-guarded)           │  │
│  └────┬──────────┬──────────────┬────────────────┘  │
│       │          │              │                    │
│  ┌────┴────┐ ┌───┴────┐  ┌─────┴──────┐            │
│  │ Prisma  │ │NextAuth│  │  Resend    │            │
│  │  (ORM)  │ │ (Auth) │  │  (Email)   │            │
│  └────┬────┘ └───┬────┘  └────────────┘            │
└───────┼──────────┼──────────────────────────────────┘
        │          │
   ┌────┴────┐  ┌──┴──────────┐
   │PostgreSQL│  │Upstash Redis│
   │   (DB)   │  │(Rate Limit) │
   └─────────┘  └─────────────┘
```

## Route Architecture

### Route Groups

The application uses Next.js route groups for layout segmentation:

| Group | Path Prefix | Layout | Purpose |
| --- | --- | --- | --- |
| `(auth)` | `/login`, `/register` | Minimal | Authentication pages |
| `(public)` | `/services`, `/book`, `/contact`, `/about`, `/how-it-works` | NavBar + Footer | Public-facing pages |
| `account` | `/account/*` | Customer layout | Authenticated customer area |
| `admin` | `/admin/*` | AdminNavigation sidebar | Admin dashboard |
| `staff` | `/staff/*` | Staff layout | Staff portal |

### API Layer (21 Endpoints)

```text
/api/
├── auth/[...nextauth]              # NextAuth catch-all
├── register                        # Customer registration
├── contact                         # Contact form submission
├── services                        # List active services
├── bookings                        # Create booking request
├── notifications                   # List customer notifications
├── notifications/[id]              # Single notification operations
├── notifications/read-all          # Bulk mark-as-read
├── account/
│   ├── reviews                     # Customer review operations
│   └── quotes/[id]/respond         # Accept/decline quote
└── admin/
    ├── bookings/[id]               # Update booking
    ├── bookings/[id]/assignments   # Manage staff assignments
    ├── bookings/[id]/assignments/[assignmentId]  # Single assignment
    ├── quotes                      # Create/list quotes
    ├── quotes/[id]                 # Quote operations
    ├── quotes/[id]/revise          # Create revision
    ├── quotes/[id]/send            # Send quote email
    ├── reviews                     # Moderate reviews
    ├── services                    # Manage services
    ├── services/[id]               # Single service operations
    └── staff                       # Manage staff accounts
```

## Data Model

### Entity Relationships

```text
User (CUSTOMER/ADMIN/STAFF)
 ├── Booking ──→ Service
 │    ├── Quote (revision chain via previousQuoteId)
 │    ├── BookingAssignment ──→ User (staff)
 │    └── Review ──→ Service (one per booking)
 ├── Notification
 └── ContactMessage (standalone)
```

### Key Model Details

**Quote revision chain** — Quotes support a linked-list revision structure via `previousQuoteId`. Each revision increments a `revision` counter. A unique constraint on `previousQuoteId` prevents concurrent or duplicate successors. The latest revision in a chain is the only one eligible for further revision.

**Review moderation** — Reviews default to `PENDING` and must transition to `PUBLISHED` before they affect aggregate ratings or appear publicly. The `Review` model links to the moderating admin and records moderation timestamps.

**Booking assignments** — The `BookingAssignment` join model supports multiple staff per booking with full audit trail (assigned by, unassigned by, timestamps, notes).

**Currency** — The platform defaults to GHS (Ghanaian Cedi). Quote amounts use `Decimal(12,2)` precision. Display formatting uses `Intl.NumberFormat` with `en-GH` locale.

## Authentication & Authorisation

### Authentication Flow

1. User submits credentials (email + password) to the NextAuth Credentials provider.
2. The provider looks up the user by email in PostgreSQL, verifies the password hash with `bcryptjs`.
3. A JWT is issued containing `id`, `name`, `email`, and `role`.
4. Session callbacks inject `id` and `role` into the client-accessible session object.

### Authorisation

- **Server-side only** — All authorisation checks happen in route handlers. Client-side UI hiding is cosmetic, not a security boundary.
- **Admin routes** use `requireAdmin()` helper which validates the session and checks for `ADMIN` role.
- **Customer routes** validate the session and check resource ownership (e.g. a customer can only view their own bookings).
- **Rate limiting** is enforced via Upstash Redis with four policies:

| Policy | Limit | Window | Applied To |
| --- | --- | --- | --- |
| `auth` | 10 requests | 10 min | Login endpoint |
| `registration` | 5 requests | 10 min | Registration endpoint |
| `contact` | 3 requests | 10 min | Contact form |
| `booking` | 10 requests | 10 min | Booking creation |

In development, rate limiting is skipped if Upstash Redis variables are unset. In production (NODE_ENV === "production"), missing Redis variables throw an explicit configuration error to prevent rate limiting from silently failing open.

### Middleware

The application uses `proxy.ts` as the middleware entry point (via NextAuth's `auth()` wrapper). This rate-limits authentication POST requests using Upstash Redis.

## Persistence & Consistency

### Transaction Boundaries

- **Quote first-send:** The `DRAFT` → `SENT` status transition and customer notification creation share a single Prisma transaction. A conditional `updateMany` guards against concurrent modifications.
- **Quote revision:** The predecessor status change (to `WITHDRAWN` if previously `SENT`), customer notification, and new revision creation are transacted together.
- **Quote expiry:** Batch processing of expired quotes uses transactions with conditional updates for concurrency safety.

### Email Delivery Boundary

Email delivery (via Resend) occurs **after** database transactions commit. This means:

- A quote can be `SENT` in the database even if Resend is unavailable.
- The API explicitly reports `emailSent: false` in this case.
- Administrators can retry while the quote remains `SENT`.
- The same pattern applies to booking status change emails.

## External Service Integration

| Service | Purpose | Configuration | Failure Mode |
| --- | --- | --- | --- |
| **PostgreSQL** | Primary data store | `DATABASE_URL` | Application cannot start |
| **Resend** | Transactional email | `RESEND_API_KEY`, `EMAIL_FROM` | `emailSent: false` — app continues without email |
| **Upstash Redis** | Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting disabled — app continues unthrottled |
| **Unsplash** | Service card images | `next.config.ts` remote patterns | Fallback to local SVG placeholders |

## Design Decisions & Caveats

1. **No `middleware.ts`** — The `proxy.ts` file serves as the middleware entry point, using NextAuth's auth wrapper for rate limiting. This is an intentional design choice to co-locate rate limiting with auth.

2. **Dual quote-send paths** — `app/api/admin/quotes/[id]/route.ts` contains an older draft-send flow with different ordering and failure semantics from the dedicated `/send` route. The admin UI uses the dedicated `/send` route. Keep these surfaces aligned when modifying quote email behaviour.

3. **Driver adapter** — Prisma uses `@prisma/adapter-pg` (PrismaPg) rather than the default query engine. This is configured in `lib/db.ts` via a `pg.Pool` instance.

4. **Service images** — Static image URLs and highlight text are maintained in `lib/services-data.ts` rather than in the database, with Unsplash URLs for high-quality photos and category-based SVG fallbacks.
