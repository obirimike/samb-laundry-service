# SAMB Laundry Platform

SAMB is a Next.js application for customer accounts and bookings, service management, and administrator-managed service quotes. The application uses PostgreSQL through Prisma and sends transactional email through Resend.

## Product and documentation

The quote workflow documented here includes administrator quote creation and sending, customer quote access, expiry, and email delivery.

- [Requirements & Product Documentation](docs/requirements-product.md)
- [Architecture & Design Documentation](docs/architecture-design.md)
- [Development & Code Documentation](docs/development-code.md)
- [Testing & Quality Assurance](docs/testing-quality.md)
- [Operations, Deployment & User Guides](docs/operations-deployment-user-guides.md)

## Local development

1. Copy `.env.example` to `.env` and replace the placeholders with local configuration.
2. Install dependencies with `npm ci`.
3. Generate Prisma Client with `npm run db:generate`.
4. Apply migrations to the configured development database with `npm run db:migrate`.
5. Optionally seed development data with `npm run db:seed`.
6. Start the application with `npm run dev`.

See [Development & Code Documentation](docs/development-code.md) for the commands and [Operations, Deployment & User Guides](docs/operations-deployment-user-guides.md) for environment and operational guidance.

## Quote email endpoint

`POST /api/admin/quotes/{id}/send` is restricted to authenticated administrators. It can send draft quotes or resend quotes already in `SENT` status. The response includes `emailSent` so callers can distinguish a successful database transition from successful email delivery. Review the [requirements](docs/requirements-product.md) and [operations guide](docs/operations-deployment-user-guides.md) before diagnosing failed delivery.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run test:e2e
npm run build
```

The current Playwright suite covers selected public pages and a mobile login interaction; quote-send-specific automated coverage is not currently present. See [Testing & Quality Assurance](docs/testing-quality.md) for scope and recommended quote workflow checks.

## Deployment

Configure production environment variables, then generate the Prisma client, apply committed migrations, and build:

```bash
npm run db:generate
npm run db:migrate
npm run build
```

Run `db:migrate` once per release against the production database; do not use `prisma migrate dev` in production. Verify a backup and rollback plan before applying migrations. See [Operations, Deployment & User Guides](docs/operations-deployment-user-guides.md) for release and email-delivery checks.

Never commit `.env` or production secrets.
