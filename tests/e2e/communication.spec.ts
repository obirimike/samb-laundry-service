import { test, expect } from "@playwright/test";
import {
  normalizePhoneNumber,
  formatPhoneNumberForWhatsApp,
  buildWhatsAppLink,
  buildWhatsAppUrl,
  buildBookingWhatsAppMessage,
  buildQuoteWhatsAppMessage,
} from "../../lib/whatsapp";
import {
  sendBookingStatusEmail,
  sendQuoteEmail,
  sendQuoteResponseEmail,
} from "../../lib/emails";

test.describe("WhatsApp and Phone Number Utility", () => {
  test("formats Ghanaian local numbers starting with 0 into international format (233...)", () => {
    expect(normalizePhoneNumber("0241234567")).toBe("233241234567");
    expect(normalizePhoneNumber("020 123 4567")).toBe("233201234567");
    expect(normalizePhoneNumber("055-987-6543")).toBe("233559876543");
    expect(normalizePhoneNumber("(024) 123-4567")).toBe("233241234567");
    expect(normalizePhoneNumber("030.123.4567")).toBe("233301234567");
  });

  test("handles Ghanaian numbers with +233, 233, or 00233 prefixes", () => {
    expect(normalizePhoneNumber("+233241234567")).toBe("233241234567");
    expect(normalizePhoneNumber("+233 24 123 4567")).toBe("233241234567");
    expect(normalizePhoneNumber("+233-(24)-123-4567")).toBe("233241234567");
    expect(normalizePhoneNumber("233241234567")).toBe("233241234567");
    expect(normalizePhoneNumber("00233241234567")).toBe("233241234567");
    expect(normalizePhoneNumber("00233 24 123 4567")).toBe("233241234567");
  });

  test("preserves valid international numbers when country code is provided", () => {
    expect(normalizePhoneNumber("+1 (415) 555-2671")).toBe("14155552671");
    expect(normalizePhoneNumber("+44 7911 123456")).toBe("447911123456");
    expect(normalizePhoneNumber("0044 7911 123456")).toBe("447911123456");
    expect(normalizePhoneNumber("+234 802 123 4567")).toBe("2348021234567");
  });

  test("rejects invalid, incomplete, ambiguous, or letters-containing phone numbers", () => {
    expect(normalizePhoneNumber(null)).toBeNull();
    expect(normalizePhoneNumber(undefined)).toBeNull();
    expect(normalizePhoneNumber("")).toBeNull();
    expect(normalizePhoneNumber("   ")).toBeNull();
    // Too short Ghanaian number:
    expect(normalizePhoneNumber("024123")).toBeNull();
    // Too long Ghanaian local number:
    expect(normalizePhoneNumber("024123456789")).toBeNull();
    // Ambiguous number without country code or Ghanaian local prefix:
    expect(normalizePhoneNumber("1234567")).toBeNull();
    expect(normalizePhoneNumber("5551234")).toBeNull();
    // Contains letters or disallowed characters:
    expect(normalizePhoneNumber("0241234567abc")).toBeNull();
    expect(normalizePhoneNumber("call 0241234567")).toBeNull();
    expect(normalizePhoneNumber("+233241234567#123")).toBeNull();
  });

  test("formatPhoneNumberForWhatsApp alias matches normalizePhoneNumber", () => {
    expect(formatPhoneNumberForWhatsApp("0241234567")).toBe(
      normalizePhoneNumber("0241234567")
    );
    expect(formatPhoneNumberForWhatsApp("invalid")).toBeNull();
  });

  test("builds valid WhatsApp Click-to-Chat URLs with encoded messages", () => {
    const message = "Hello Kofi,\nThis is SAMB.";
    const url = buildWhatsAppUrl("0241234567", message);
    expect(url).toBe(
      `https://wa.me/233241234567?text=${encodeURIComponent(message)}`
    );

    // Without message
    expect(buildWhatsAppUrl("0241234567")).toBe("https://wa.me/233241234567");

    // Invalid phone returns null
    expect(buildWhatsAppUrl("invalid", message)).toBeNull();
    expect(buildWhatsAppUrl(null, message)).toBeNull();

    // Alias matches
    expect(buildWhatsAppLink("0241234567", message)).toBe(url);
  });

  test("prepared booking WhatsApp message contains required details and excludes private information", () => {
    const bookingMessage = buildBookingWhatsAppMessage({
      customerName: "Ama Mensah",
      bookingNumber: "SAMB-2026-TEST1",
      serviceName: "Deep Home Cleaning",
      preferredDate: new Date("2026-11-15T00:00:00.000Z"),
      preferredTime: "10:00",
    });

    expect(bookingMessage).toContain("Hello Ama Mensah,");
    expect(bookingMessage).toContain("SAMB-2026-TEST1");
    expect(bookingMessage).toContain("Deep Home Cleaning");
    expect(bookingMessage).toContain("10:00");
    expect(bookingMessage).toContain("SAMB Laundry & Cleaning Services");

    // Private operational info must not be included
    expect(bookingMessage).not.toContain("password");
    expect(bookingMessage).not.toContain("adminNotes");
    expect(bookingMessage).not.toContain("specialInstructions");
  });

  test("prepared quote WhatsApp message adapts according to status without exposing draft amounts", () => {
    // DRAFT status
    const draftMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      bookingNumber: "SAMB-2026-TEST1",
      status: "DRAFT",
    });

    expect(draftMessage).toContain("Hello Kwame Asante,");
    expect(draftMessage).toContain("SAMB-Q-1001");
    expect(draftMessage).toContain("preparing your service quotation");
    // Must NOT contain amounts or draft pricing
    expect(draftMessage).not.toContain("GHS");
    expect(draftMessage).not.toContain("total");

    // SENT status
    const sentMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      bookingNumber: "SAMB-2026-TEST1",
      status: "SENT",
      appUrl: "https://samb.example.com",
    });

    expect(sentMessage).toContain("Hello Kwame Asante,");
    expect(sentMessage).toContain("SAMB-Q-1001");
    expect(sentMessage).toContain("https://samb.example.com/account/quotes");

    // ACCEPTED status
    const acceptedMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      status: "ACCEPTED",
    });
    expect(acceptedMessage).toContain("accepting service quotation");

    // DECLINED status
    const declinedMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      status: "DECLINED",
    });
    expect(declinedMessage).toContain("noted your response");

    // EXPIRED status
    const expiredMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      status: "EXPIRED",
    });
    expect(expiredMessage).toContain("expired");

    // WITHDRAWN status
    const withdrawnMessage = buildQuoteWhatsAppMessage({
      customerName: "Kwame Asante",
      quoteNumber: "SAMB-Q-1001",
      status: "WITHDRAWN",
    });
    expect(withdrawnMessage).toContain("withdrawn");
  });
});

test.describe("Optional Email Notification System", () => {
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.EMAIL_FROM;

  test.afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.RESEND_API_KEY = originalApiKey;
    } else {
      delete process.env.RESEND_API_KEY;
    }

    if (originalFrom !== undefined) {
      process.env.EMAIL_FROM = originalFrom;
    } else {
      delete process.env.EMAIL_FROM;
    }
  });

  test("skips booking status email gracefully when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.EMAIL_FROM = "test@example.com";

    const result = await sendBookingStatusEmail({
      to: "customer@example.com",
      customerName: "Test Customer",
      bookingNumber: "SAMB-TEST",
      status: "CONFIRMED",
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
  });

  test("skips quote email gracefully when EMAIL_FROM is missing", async () => {
    process.env.RESEND_API_KEY = "re_dummy_test_key";
    delete process.env.EMAIL_FROM;

    const result = await sendQuoteEmail({
      to: "customer@example.com",
      customerName: "Test Customer",
      quoteNumber: "SAMB-Q-TEST",
      bookingNumber: "SAMB-TEST",
      serviceName: "Cleaning",
      amount: "150.00",
      currency: "GHS",
      breakdown: [],
      terms: null,
      expiresAt: null,
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
  });

  test("skips quote response email gracefully when both configuration variables are missing", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;

    const result = await sendQuoteResponseEmail({
      to: "admin@example.com",
      adminName: "Admin",
      customerName: "Customer",
      quoteNumber: "SAMB-Q-TEST",
      bookingNumber: "SAMB-TEST",
      decision: "ACCEPTED",
      responseNote: "Ready",
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
  });

  test("gracefully handles invalid recipient email addresses", async () => {
    process.env.RESEND_API_KEY = "re_dummy_test_key";
    process.env.EMAIL_FROM = "test@example.com";

    const result = await sendBookingStatusEmail({
      to: "not-an-email",
      customerName: "Customer",
      bookingNumber: "SAMB-TEST",
      status: "CONFIRMED",
    });

    expect(result.success).toBe(false);
  });
});
