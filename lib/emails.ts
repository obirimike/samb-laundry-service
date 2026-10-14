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