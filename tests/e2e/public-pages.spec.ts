import { expect, test } from "@playwright/test";

test("public pages render their primary content", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { name: "Professional cleaning, with care in every detail." })
  ).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "How can we help?" })).toBeVisible();

  await page.goto("/login");
  page.on("pageerror", error => {
  console.error("LOGIN PAGE ERROR:", error.message);
});

page.on("console", message => {
  if (message.type() === "error") {
    console.error("BROWSER ERROR:", message.text());
  }
});

await page.goto("/login");

console.log("LOGIN URL:", page.url());
console.log("LOGIN BODY:", await page.locator("body").innerText());
  console.log(
  "LOGIN HEADINGS:",
  await page.getByRole("heading").allTextContents()
);
  await expect(page.getByLabel("Email address")).toBeVisible();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
});

test("password visibility control works on a mobile viewport", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  await page.goto("/login");

  const password = page.locator("#password");
  const toggle = page.getByTestId("toggle-password");

  await expect(password).toHaveAttribute("type", "password");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.tap();

  await expect(password).toHaveAttribute("type", "text");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAccessibleName("Hide password");

  await toggle.tap();

  await expect(password).toHaveAttribute("type", "password");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toHaveAccessibleName("Show password");

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    )
    .toBe(true);

  await context.close();
});

test("service detail links open the selected service", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services");

  const detailsLink = page.getByRole("link", { name: "Details" }).first();
  console.log("Details href:", await detailsLink.getAttribute("href"));
  await expect(detailsLink).toBeVisible();
  await detailsLink.click();

  await expect(page).toHaveURL(/\/services\/[^/]+$/);
  await expect(
    page.getByRole("heading", { name: "About this service" })
  ).toBeVisible();
});
