/**
 * Phone number normalization and WhatsApp Click-to-Chat utilities.
 *
 * Rules:
 * - Support Ghanaian local numbers in common formats (e.g., 0241234567 -> 233241234567).
 * - Support Ghanaian numbers already starting with +233, 233, or 00233.
 * - Preserve valid international phone numbers when an explicit country code is provided (+ or 00 prefix).
 * - Safely remove whitespace, brackets, hyphens, and dots.
 * - Reject invalid, incomplete, or letters-containing phone numbers.
 * - Do not guess country codes for ambiguous local numbers.
 */

export function normalizePhoneNumber(
  raw: string | null | undefined
): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  // Reject any string that contains characters other than digits, whitespace, or standard formatting punctuation.
  if (/[^\d\s+\-()./]/.test(trimmed)) {
    return null;
  }

  const hasPlusPrefix = trimmed.startsWith("+");
  const hasDoubleZeroPrefix = trimmed.startsWith("00");

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  // 1. Explicit international format with leading '+' (e.g. +233241234567, +14155552671, +447911123456)
  if (hasPlusPrefix) {
    // E.164: country code (1-3 digits starting 1-9) + subscriber number (total 8-15 digits)
    if (/^[1-9]\d{7,14}$/.test(digits)) {
      return digits;
    }
    return null;
  }

  // 2. Explicit international format with '00' prefix (e.g. 00233241234567, 00447911123456)
  if (hasDoubleZeroPrefix) {
    const without00 = digits.replace(/^00/, "");
    if (/^[1-9]\d{7,14}$/.test(without00)) {
      return without00;
    }
    return null;
  }

  // 3. Ghanaian number already including 233 country code (12 digits total: 233 + 9 digits)
  if (digits.startsWith("233")) {
    if (/^233\d{9}$/.test(digits)) {
      return digits;
    }
    return null;
  }

  // 4. Ghanaian local format starting with 0 (10 digits total: 0 + 9 digits, e.g. 0241234567)
  if (digits.startsWith("0")) {
    if (/^0\d{9}$/.test(digits)) {
      return `233${digits.slice(1)}`;
    }
    return null;
  }

  // Any other number without explicit country code (+ / 00 / 233) is ambiguous or incomplete.
  // We do not guess country codes for ambiguous numbers.
  return null;
}

export const formatPhoneNumberForWhatsApp = normalizePhoneNumber;

export function buildWhatsAppLink(
  rawPhone: string | null | undefined,
  message?: string
): string | null {
  const normalized = normalizePhoneNumber(rawPhone);

  if (!normalized) {
    return null;
  }

  const safeMessage = message ? encodeURIComponent(message) : "";

  return safeMessage
    ? `https://wa.me/${normalized}?text=${safeMessage}`
    : `https://wa.me/${normalized}`;
}

export const buildWhatsAppUrl = buildWhatsAppLink;

function formatBookingDate(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);

    return new Intl.DateTimeFormat("en-GH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Builds a prepared WhatsApp message for booking management.
 * Contains customer name, booking reference, service name, date and time.
 * Does NOT contain addresses, special instructions, admin notes, or private data.
 */
export function buildBookingWhatsAppMessage({
  customerName,
  bookingNumber,
  serviceName,
  preferredDate,
  preferredTime,
}: {
  customerName?: string | null;
  bookingNumber: string;
  serviceName: string;
  preferredDate: Date | string;
  preferredTime?: string | null;
}): string {
  const name = customerName?.trim() || "Customer";
  const formattedDate = formatBookingDate(preferredDate);
  const timeDetails = preferredTime ? ` at ${preferredTime}` : "";

  return [
    `Hello ${name},`,
    "",
    "This is SAMB Laundry & Cleaning Services.",
    "",
    `We are contacting you regarding your booking ${bookingNumber} for ${serviceName}, scheduled for ${formattedDate}${timeDetails}.`,
    "",
    "Please contact us if you have any questions.",
    "",
    "Thank you,",
    "SAMB Laundry & Cleaning Services.",
  ].join("\n");
}

/**
 * Builds a prepared WhatsApp message for quote management.
 * Adapts to the actual quote status.
 * Does NOT include draft quote amounts or unapproved commercial information.
 */
export function buildQuoteWhatsAppMessage({
  customerName,
  quoteNumber,
  bookingNumber,
  status,
  appUrl,
}: {
  customerName?: string | null;
  quoteNumber: string;
  bookingNumber?: string | null;
  status?: string;
  appUrl?: string;
}): string {
  const name = customerName?.trim() || "Customer";
  const baseUrl = (
    appUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
  const quotePageUrl = `${baseUrl}/account/quotes`;
  const bookingRef = bookingNumber ? ` for booking ${bookingNumber}` : "";

  switch (status) {
    case "DRAFT":
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `We are currently preparing your service quotation ${quoteNumber}${bookingRef}. We will notify you as soon as it is ready for your review.`,
        "",
        "Please contact us if you have any questions.",
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");

    case "ACCEPTED":
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `Thank you for accepting service quotation ${quoteNumber}${bookingRef}. Our team is proceeding with your service arrangements.`,
        "",
        "Please contact us if you have any questions.",
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");

    case "DECLINED":
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `We have noted your response regarding service quotation ${quoteNumber}${bookingRef}. Please let us know if you would like to discuss adjustments or alternative options.`,
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");

    case "EXPIRED":
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `Your service quotation ${quoteNumber}${bookingRef} has expired. If you would like an updated quote, please log in to your SAMB account or contact us:`,
        quotePageUrl,
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");

    case "WITHDRAWN":
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `Service quotation ${quoteNumber}${bookingRef} has been withdrawn while we prepare an updated quotation for you. We will update you shortly.`,
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");

    case "SENT":
    default:
      return [
        `Hello ${name},`,
        "",
        "This is SAMB Laundry & Cleaning Services.",
        "",
        `We have an update regarding your service quotation ${quoteNumber}${bookingRef}.`,
        "",
        "Please log in to your SAMB account to review the quotation and respond:",
        quotePageUrl,
        "",
        "Thank you,",
        "SAMB Laundry & Cleaning Services.",
      ].join("\n");
  }
}
