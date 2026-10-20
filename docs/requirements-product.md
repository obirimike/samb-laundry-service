# Requirements & Product Documentation

## Scope

This document describes the service-quote workflow, with emphasis on the administrator endpoint `POST /api/admin/quotes/{id}/send` implemented in `app/api/admin/quotes/[id]/send/route.ts`. It is a feature-level reference, not a complete specification of every SAMB platform workflow.

## Users and outcomes

- **Administrator:** prepares a quote for a non-cancelled booking and sends it to the booking customer. The administrator can resend a quote while it remains in `SENT` status.
- **Customer:** receives the quote by email and can review the quote from the customer account. Sending a quote does not confirm the booking or record payment.

## Functional requirements

1. Only a signed-in user with the `ADMIN` role may send a quote.
2. A quote must exist and be in `DRAFT` or `SENT` status to be emailed.
3. If a draft or sent quote has an expiry time at or before the current time, the send request changes its status to `EXPIRED` and does not send the email.
4. The first send changes the quote from `DRAFT` to `SENT`, records `sentAt`, and creates a `QUOTE_SENT` customer notification.
5. A quote already in `SENT` status can be emailed again. Resending does not create another first-send notification or replace the original `sentAt`.
6. Quote email content includes the quote and booking numbers, service, amount and currency, itemized breakdown, terms, expiry when present, and a link to `/account/quotes`.
7. The caller must be told whether the email provider accepted the email. A failed provider send does not roll back the first-send status or notification; the endpoint returns a successful HTTP response with `emailSent: false` and an explanatory message. An administrator can retry while the quote remains `SENT`.
8. A quote send does not accept a request body and does not itself cause a customer response, booking confirmation, or payment.

## API contract

### Request

```http
POST /api/admin/quotes/{id}/send
```

`{id}` is the quote's database identifier. The request requires the authenticated administrator session and has no JSON body.

### Success response

Successful request processing returns HTTP `200` with:

```json
{
  "message": "Quote sent successfully.",
  "emailSent": true,
  "status": "SENT"
}
```

The message varies for a resend or an email provider failure. Clients should use `emailSent`, not the message text, to determine delivery status.

### Error responses

| HTTP status | Condition |
| --- | --- |
| `401` | No authenticated user session. |
| `403` | Authenticated user is not an administrator. |
| `404` | No quote exists for the supplied identifier. |
| `409` | Quote status is not `DRAFT` or `SENT`, or a concurrent update prevents the first-send transition. |
| `400` | Quote has expired; the quote is marked `EXPIRED`. |
| `500` | Unexpected server-side error. |

The email provider reporting failure is not an HTTP error in this endpoint: it returns `200`, `emailSent: false`, and a message that the quote remains available in the customer's account.

## Quote lifecycle relevant to sending

```text
DRAFT -- first send --> SENT -- expiry processing --> EXPIRED
                         |
                         +-- administrator resend --> SENT
```

Other quote states (`ACCEPTED`, `DECLINED`, `WITHDRAWN`, and `EXPIRED`) cannot be sent with this endpoint. Quote expiry is also processed when quote lists and quote pages are loaded.

## Acceptance criteria

- Anonymous callers and authenticated non-admin users cannot send a quote.
- A valid unexpired draft becomes sent, receives a `sentAt` timestamp, creates one customer notification, and attempts email delivery.
- A sent quote may be resent without creating a duplicate first-send notification.
- An expired quote is marked expired and is not emailed.
- A provider failure is visible to the administrator and reports `emailSent: false`; it does not present the email as delivered.
- Unsupported states and concurrent state changes produce an explicit conflict response.
