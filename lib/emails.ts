import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

const statusContent: Record<
  string,
  { title: string; message: string }
> = {
  CONFIRMED: {
    title: "Your booking is confirmed",
    message:
      "Your service request has been confirmed. We look forward to serving you.",
  },
  IN_PROGRESS: {
    title: "Your service has started",
    message:
      "Our team has started working on your booking.",
  },
  COMPLETED: {
    title: "Your service is complete",
    message:
      "Your booking has been marked as completed. Thank you for choosing SAMB's Laundry and Klinin Services.",
  },
  CANCELLED: {
    title: "Your booking has been cancelled",
    message:
      "Your booking has been cancelled. Please contact us if you need assistance.",
  },
};

export async function sendBookingStatusEmail({
  to,
  customerName,
  bookingNumber,
  status,
}: {
  to: string;
  customerName: string;
  bookingNumber: string;
  status: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Email not sent: RESEND_API_KEY is not configured.");
    return { success: false };
  }

  const content = statusContent[status];

  if (!content) {
    return { success: false };
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const safeName = escapeHtml(customerName || "Customer");
  const safeBookingNumber = escapeHtml(bookingNumber);
  const safeMessage = escapeHtml(content.message);
  const safeTitle = escapeHtml(content.title);

  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "SAMB's Laundry and Klinin Services <onboarding@resend.dev>",
      to: [to],
      subject: `${content.title} — ${bookingNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#172033;line-height:1.6">
          <div style="background:#123b73;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#ffffff;font-size:22px;margin:0">SAMB's Laundry and Klinin Services</h1>
          </div>
          <div style="padding:28px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px">
            <p>Hello ${safeName},</p>
            <h2 style="font-size:21px">${safeTitle}</h2>
            <p>${safeMessage}</p>
            <p><strong>Booking number:</strong> ${safeBookingNumber}</p>
            <p>
              <a href="${appUrl}/account/bookings"
                style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px">
                View my bookings
              </a>
            </p>
            <p style="font-size:13px;color:#64748b">
              If you have questions, please contact our team.
            </p>
          </div>
        </div>
      `,
      text: [
        `Hello ${customerName || "Customer"},`,
        "",
        content.title,
        content.message,
        `Booking number: ${bookingNumber}`,
        `View your bookings: ${appUrl}/account/bookings`,
        "",
        "SAMB's Laundry and Klinin Services",
      ].join("\n"),
    });

    if (error) {
      console.error("Resend email error:", error.message);
      return { success: false };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Failed to send booking status email:", error);
    return { success: false };
  }
}

type QuoteEmailLine = {
  description?: unknown;
  quantity?: unknown;
  unitPrice?: unknown;
  total?: unknown;
};

function formatQuoteMoney(amount: number | string, currency: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function getQuoteEmailLines(value: unknown): QuoteEmailLine[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is QuoteEmailLine =>
      typeof item === "object" && item !== null
  );
}
export async function sendQuoteEmail({
  to,
  customerName,
  quoteNumber,
  bookingNumber,
  serviceName,
  amount,
  currency,
  breakdown,
  terms,
  expiresAt,
}: {
  to: string;
  customerName: string;
  quoteNumber: string;
  bookingNumber: string;
  serviceName: string;
  amount: string;
  currency: string;
  breakdown: unknown;
  terms: string | null;
  expiresAt: Date | null;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Quote email not sent: RESEND_API_KEY is not configured.");
    return { success: false };
  }

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const lines = getQuoteEmailLines(breakdown);

  const htmlRows = lines
    .map((item) => {
      const description = escapeHtml(String(item.description ?? "Service"));
      const quantity = escapeHtml(String(item.quantity ?? 1));
      const total = Number(item.total ?? 0);

      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">
            ${description}
          </td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">
            ${quantity}
          </td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">
            ${escapeHtml(formatQuoteMoney(total, currency))}
          </td>
        </tr>`;
    })
    .join("");

  const textRows = lines.map((item) => {
    const total = Number(item.total ?? 0);

    return `${String(item.description ?? "Service")} × ${
      item.quantity ?? 1
    }: ${formatQuoteMoney(total, currency)}`;
  });

  const safeName = escapeHtml(customerName || "Customer");
  const safeQuoteNumber = escapeHtml(quoteNumber);
  const safeBookingNumber = escapeHtml(bookingNumber);
  const safeServiceName = escapeHtml(serviceName);
  const safeAmount = escapeHtml(formatQuoteMoney(amount, currency));
  const safeTerms = escapeHtml(terms || "Please contact us if you have questions.")
    .replace(/\r?\n/g, "<br />");
  const safeExpiry = expiresAt
    ? escapeHtml(
        expiresAt.toLocaleDateString("en-GH", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Africa/Accra",
        })
      )
    : "Not specified";

  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "SAMB's Laundry and Klinin Services <onboarding@resend.dev>",
      to: [to],
      subject: `Your service quote ${quoteNumber} — SAMB`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033;line-height:1.6">
          <div style="background:#123b73;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#fff;font-size:22px">
              SAMB's Laundry and Klinin Services
            </h1>
          </div>
          <div style="padding:26px;border:1px solid #e2e8f0;border-top:0">
            <p>Hello ${safeName},</p>
            <h2>Your service quotation is ready</h2>
            <p>We have prepared a quote for your requested service.</p>
            <p><strong>Quote:</strong> ${safeQuoteNumber}</p>
            <p><strong>Booking:</strong> ${safeBookingNumber}</p>
            <p><strong>Service:</strong> ${safeServiceName}</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
              <thead>
                <tr style="background:#f8fafc;text-align:left">
                  <th style="padding:10px">Description</th>
                  <th style="padding:10px">Qty</th>
                  <th style="padding:10px;text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>${htmlRows}</tbody>
            </table>
            <p style="font-size:20px;font-weight:bold">
              Total: ${safeAmount}
            </p>
            <p><strong>Valid until:</strong> ${safeExpiry}</p>
            <p><strong>Terms:</strong><br />${safeTerms}</p>
            <p>Review the quote and respond through your account:</p>
            <p>
              <a href="${appUrl}/account/quotes"
                style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px">
                Review my quote
              </a>
            </p>
            <p style="font-size:13px;color:#64748b">
              This quotation does not itself confirm the booking or record payment.
            </p>
          </div>
        </div>
      `,
      text: [
        `Hello ${customerName || "Customer"},`,
        "",
        "Your service quotation is ready.",
        `Quote: ${quoteNumber}`,
        `Booking: ${bookingNumber}`,
        `Service: ${serviceName}`,
        "",
        ...textRows,
        "",
        `Total: ${formatQuoteMoney(amount, currency)}`,
        `Valid until: ${
          expiresAt ? expiresAt.toISOString() : "Not specified"
        }`,
        `Terms: ${terms || "Please contact us if you have questions."}`,
        "",
        `Review your quote: ${appUrl}/account/quotes`,
        "",
        "SAMB's Laundry and Klinin Services",
      ].join("\n"),
    });

    if (error) {
      console.error("Quote email error:", error.message);
      return { success: false };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Failed to send quote email:", error);
    return { success: false };
  }
}

export async function sendQuoteResponseEmail({
  to,
  adminName,
  customerName,
  quoteNumber,
  bookingNumber,
  decision,
  responseNote,
}: {
  to: string;
  adminName: string;
  customerName: string;
  quoteNumber: string;
  bookingNumber: string;
  decision: "ACCEPTED" | "DECLINED";
  responseNote: string | null;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Quote response email not sent: RESEND_API_KEY is missing.");
    return { success: false };
  }

  const accepted = decision === "ACCEPTED";
  const title = accepted ? "Quote accepted" : "Quote declined";

  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "SAMB's Laundry and Klinin Services <onboarding@resend.dev>",
      to: [to],
      subject: `${title}: ${quoteNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.6">
          <div style="background:#123b73;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#fff;font-size:22px">
              SAMB's Laundry and Klinin Services
            </h1>
          </div>
          <div style="padding:26px;border:1px solid #e2e8f0;border-top:0">
            <p>Hello ${escapeHtml(adminName || "Administrator")},</p>
            <h2>${title}</h2>
            <p>
              ${escapeHtml(customerName)} has ${
                accepted ? "accepted" : "declined"
              } quote ${escapeHtml(quoteNumber)}.
            </p>
            <p><strong>Booking:</strong> ${escapeHtml(bookingNumber)}</p>
            ${
              responseNote
                ? `<p><strong>Customer note:</strong><br />${escapeHtml(
                    responseNote
                  ).replace(/\r?\n/g, "<br />")}</p>`
                : ""
            }
          </div>
        </div>
      `,
      text: [
        `Hello ${adminName || "Administrator"},`,
        "",
        `${customerName} has ${accepted ? "accepted" : "declined"} quote ${quoteNumber}.`,
        `Booking: ${bookingNumber}`,
        responseNote ? `Customer note: ${responseNote}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Quote response email error:", error.message);
      return { success: false };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Failed to send quote response email:", error);
    return { success: false };
  }
}
