# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> password visibility control works on a mobile viewport
- Location: tests\e2e\public-pages.spec.ts:38:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#password')
Expected: "text"
Received: "password"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('#password') with timeout 5000ms
  - waiting for locator('#password')
    14 × locator resolved to <input value="" required="" id="password" type="password" name="password" spellcheck="false" autocapitalize="none" autocomplete="current-password" placeholder="Enter your password" class="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-black outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"/>
       - unexpected value "password"

```

```yaml
- textbox "Password":
  - /placeholder: Enter your password
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("public pages render their primary content", async ({ page }) => {
  4  |   await page.goto("/about");
  5  |   await expect(
  6  |     page.getByRole("heading", { name: "Professional cleaning, with care in every detail." })
  7  |   ).toBeVisible();
  8  | 
  9  |   await page.goto("/contact");
  10 |   await expect(page.getByRole("heading", { name: "How can we help?" })).toBeVisible();
  11 | 
  12 |   await page.goto("/login");
  13 |   page.on("pageerror", error => {
  14 |   console.error("LOGIN PAGE ERROR:", error.message);
  15 | });
  16 | 
  17 | page.on("console", message => {
  18 |   if (message.type() === "error") {
  19 |     console.error("BROWSER ERROR:", message.text());
  20 |   }
  21 | });
  22 | 
  23 | await page.goto("/login");
  24 | 
  25 | console.log("LOGIN URL:", page.url());
  26 | console.log("LOGIN BODY:", await page.locator("body").innerText());
  27 |   console.log(
  28 |   "LOGIN HEADINGS:",
  29 |   await page.getByRole("heading").allTextContents()
  30 | );
  31 |   await expect(page.getByLabel("Email address")).toBeVisible();
  32 | 
  33 |   await page.goto("/register");
  34 |   await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  35 |   await expect(page.getByLabel("Full name")).toBeVisible();
  36 | });
  37 | 
  38 | test("password visibility control works on a mobile viewport", async ({
  39 |   browser,
  40 | }) => {
  41 |   const context = await browser.newContext({
  42 |     viewport: { width: 390, height: 844 },
  43 |     isMobile: true,
  44 |     hasTouch: true,
  45 |   });
  46 | 
  47 |   const page = await context.newPage();
  48 | 
  49 |   await page.goto("/login");
  50 | 
  51 |   const password = page.locator("#password");
  52 |   const toggle = page.getByTestId("toggle-password");
  53 | 
  54 |   await expect(password).toHaveAttribute("type", "password");
  55 |   await expect(toggle).toHaveAttribute("aria-pressed", "false");
  56 | 
  57 |   await toggle.tap();
  58 | 
> 59 |   await expect(password).toHaveAttribute("type", "text");
     |                          ^ Error: expect(locator).toHaveAttribute(expected) failed
  60 |   await expect(toggle).toHaveAttribute("aria-pressed", "true");
  61 |   await expect(toggle).toHaveAccessibleName("Hide password");
  62 | 
  63 |   await toggle.tap();
  64 | 
  65 |   await expect(password).toHaveAttribute("type", "password");
  66 |   await expect(toggle).toHaveAttribute("aria-pressed", "false");
  67 |   await expect(toggle).toHaveAccessibleName("Show password");
  68 | 
  69 |   await expect
  70 |     .poll(() =>
  71 |       page.evaluate(
  72 |         () => document.documentElement.scrollWidth <= window.innerWidth
  73 |       )
  74 |     )
  75 |     .toBe(true);
  76 | 
  77 |   await context.close();
  78 | });
  79 | 
  80 | test("service detail links open the selected service", async ({ page }) => {
  81 |   await page.setViewportSize({ width: 390, height: 844 });
  82 |   await page.goto("/services");
  83 | 
  84 |   const detailsLink = page.getByRole("link", { name: "Details" }).first();
  85 |   console.log("Details href:", await detailsLink.getAttribute("href"));
  86 |   await expect(detailsLink).toBeVisible();
  87 |   await detailsLink.click();
  88 | 
  89 |   await expect(page).toHaveURL(/\/services\/[^/]+$/);
  90 |   await expect(
  91 |     page.getByRole("heading", { name: "About this service" })
  92 |   ).toBeVisible();
  93 | });
  94 | 
```