# Requirements & Product Documentation

## Scope

This document describes the functional requirements, user workflows, and API contracts for the SAMB platform. It covers all major features: service catalogue, booking management, quoting, staff assignments, customer reviews, notifications, and contact messaging.

---

## Users and Roles

| Role | Description |
| --- | --- |
| **Customer** | Browses services, submits booking requests, receives and responds to quotes, writes reviews for completed bookings, manages their account profile and notifications. |
| **Administrator** | Manages all bookings, creates and sends itemised quotes with revision history, assigns staff to bookings, moderates customer reviews, manages services and staff accounts, handles contact messages. |
| **Staff** | Views assigned bookings and work schedule. |

---

## Feature Specifications

### 1. Service Catalogue

**Requirements:**

1. Active services are displayed publicly, grouped by category (Cleaning, Laundry, Domestic Support, Pest Control).
2. Each service card displays the name, description, category, image, feature highlights, and aggregate star rating from published reviews.
3. Services without published reviews show "No reviews yet" instead of a rating.
4. Each service has a detail page (`/services/[slug]`) that displays published reviews.
5. Administrators can create, edit, activate, and deactivate services from `/admin/services`.

### 2. Booking Workflow

**Requirements:**

1. Any visitor (guest or authenticated customer) can submit a booking request for an active service.
2. A booking captures: service, preferred date and time, address, property type, number of rooms, estimated size, and special instructions.
3. Each booking receives a unique booking number.
4. Booking status lifecycle: `PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` or `CANCELLED` (from any non-completed state).
5. Administrators manage bookings from `/admin/bookings` and can update status, add admin notes, and view individual booking details.
6. Customers view their bookings and status history from `/account/bookings`.
7. Status changes trigger email notifications to the customer (Confirmed, In Progress, Completed, Cancelled) with booking details and contextual messaging.
8. Booking requests are rate-limited to 10 per 10 minutes per IP.

### 3. Quote Workflow

**Requirements:**

1. Only a signed-in user with the `ADMIN` role may create, revise, or send a quote.
2. A quote is linked to a booking and contains: itemised breakdown (JSON), total amount, currency (default GHS), optional terms, and optional expiry date.
3. A quote must be in `DRAFT` or `SENT` status to be emailed.
4. If a draft or sent quote has an expiry at or before the current time, the send request changes its status to `EXPIRED` and does not send the email.
5. The first send changes the quote from `DRAFT` to `SENT`, records `sentAt`, and creates a `QUOTE_SENT` customer notification.
6. A quote already in `SENT` status can be re-emailed. Resending does not create another first-send notification or replace the original `sentAt`.
7. Quote email content includes: quote and booking numbers, service name, amount and currency, itemised breakdown, terms, expiry (when present), and a link to `/account/quotes`.
8. The caller is told whether the email provider accepted the email. A failed provider send does not roll back the first-send status or notification; the endpoint returns `200` with `emailSent: false`.
9. A quote send does not accept a request body and does not itself confirm a booking or record payment.
10. An administrator may revise a `DRAFT`, `SENT`, or `EXPIRED` quote for a non-cancelled booking. A revision is a new `DRAFT` quote linked to its predecessor, increments the revision number, and preserves the predecessor's response history.
11. Revising a `SENT` quote changes the predecessor to `WITHDRAWN` and notifies the customer so the outdated quote cannot be accepted.
12. Accepted, declined, withdrawn, or already-superseded quotes cannot be revised.
13. Customers can see revision numbers and historical quote states. Only a quote currently in `SENT` status can be accepted or declined.
14. Sent quotes past their expiry date are batch-processed to `EXPIRED` status, with notifications created for both customer and admin.

**Quote lifecycle:**

```text
DRAFT ── first send ──→ SENT ── expiry processing ──→ EXPIRED
                         │
                         ├── administrator resend ──→ SENT
                         ├── customer accepts ──→ ACCEPTED
                         └── customer declines ──→ DECLINED

DRAFT or SENT ── revision ──→ WITHDRAWN (if SENT) + new linked DRAFT
EXPIRED ── revision ──→ new linked DRAFT
```

### 4. Staff Assignments

**Requirements:**

1. Administrators assign staff members to bookings from `/admin/assignments`.
2. An assignment records: booking, staff member, assigning admin, optional notes, and timestamps.
3. Staff can be unassigned (with the unassigning admin and timestamp recorded).
4. Multiple staff can be assigned to the same booking; each assignment is tracked individually.
5. Staff view their active assignments from `/staff`.

### 5. Customer Reviews

**Requirements:**

1. Customers can submit one review per completed booking.
2. A review contains a rating (1–5 integer) and an optional text comment.
3. Reviews default to `PENDING` status and must be moderated before appearing publicly.
4. Administrators moderate reviews from `/admin/reviews`: publish, hide, or add moderation notes.
5. Published reviews appear on the service detail page and contribute to the aggregate star rating on service cards.
6. The aggregate rating counts only `PUBLISHED` reviews. Services without published reviews display no rating.

### 6. Notifications

**Requirements:**

1. In-app notifications are created for: quote sends, booking status changes, quote responses, and review moderation events.
2. Customers view notifications from `/account/notifications`.
3. Notifications can be marked as read individually or all at once.
4. Notifications are deleted when their associated user is deleted (cascade).

### 7. Contact Form

**Requirements:**

1. Visitors submit contact messages with: name, email, optional phone, subject, and message body.
2. Submissions are rate-limited to 3 per 10 minutes per IP.
3. Contact messages default to `NEW` status.
4. Administrators view and manage messages from `/admin/messages`, updating status to `READ` or `RESOLVED`.

---

## API Contracts

### Quote Send

```http
POST /api/admin/quotes/{id}/send
```

Requires authenticated administrator session. No request body.

**Success response (200):**

```json
{
  "message": "Quote sent successfully.",
  "emailSent": true,
  "status": "SENT"
}
```

**Error responses:**

| HTTP Status | Condition |
| --- | --- |
| `401` | No authenticated session |
| `403` | User is not an administrator |
| `404` | Quote not found |
| `409` | Quote status is not `DRAFT` or `SENT`, or concurrent update conflict |
| `400` | Quote has expired (marked `EXPIRED`) |
| `500` | Unexpected server error |

> **Note:** Email provider failure is not an HTTP error — the endpoint returns `200` with `emailSent: false`.

### Quote Revision

```http
POST /api/admin/quotes/{id}/revise
```

Requires authenticated administrator and a JSON body with 1–50 itemised lines, optional terms, and optional expiry. Returns `201` with the new linked draft revision.

| HTTP Status | Condition |
| --- | --- |
| `400` | Invalid input |
| `404` | Source quote not found |
| `409` | Unsupported source state, cancelled booking, duplicate revision, or concurrent change |

### Quote Response (Customer)

```http
PATCH /api/account/quotes/{id}/respond
```

Requires authenticated customer. Body includes the response action (accept or decline).

### Booking Management (Admin)

```http
PATCH /api/admin/bookings/{id}
```

Requires authenticated administrator. Updates booking status and/or admin notes.

### Contact Form

```http
POST /api/contact
```

Public endpoint, rate-limited. Body includes name, email, phone (optional), subject, and message.

### Registration

```http
POST /api/register
```

Public endpoint, rate-limited (5 per 10 minutes per IP). Creates a new customer account.

---

## Acceptance Criteria

### Quoting

- Anonymous callers and non-admin users cannot send a quote.
- A valid unexpired draft becomes sent, receives a `sentAt` timestamp, creates one customer notification, and attempts email delivery.
- A sent quote may be resent without duplicating the first-send notification.
- An expired quote is marked expired and is not emailed.
- A provider failure reports `emailSent: false` and does not present the email as delivered.
- Unsupported states and concurrent changes produce an explicit conflict response.
- A sent predecessor is withdrawn when revised; customers cannot respond to withdrawn quotes.

### Bookings

- Status transitions are validated server-side and cannot be bypassed by client requests.
- Booking status emails are sent for each transition to the customer's registered email.
- Rate limiting prevents booking request abuse.

### Reviews

- Only one review is permitted per booking (unique constraint on `bookingId`).
- Only published reviews appear in public aggregate ratings.
- Administrators can moderate any review without altering the customer's original content.

### Contact

- Rate limiting prevents contact form abuse.
- Messages are persisted regardless of whether downstream processing occurs.
