# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> password visibility control works on a mobile viewport
- Location: tests\e2e\public-pages.spec.ts:21:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('button', { name: 'Show password' })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('button', { name: 'Show password' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Show password' })
    13 × locator resolved to <button type="button" aria-pressed="false" aria-label="Show password" class="absolute inset-y-0 right-0 z-10 flex h-12 w-12 touch-manipulation items-center justify-center rounded-r-xl text-slate-500 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-indigo-600">…</button>
       - unexpected value "false"

```

```yaml
- button "Show password"
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
  13 |   await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  14 |   await expect(page.getByLabel("Email address")).toBeVisible();
  15 | 
  16 |   await page.goto("/register");
  17 |   await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  18 |   await expect(page.getByLabel("Full name")).toBeVisible();
  19 | });
  20 | 
  21 | test("password visibility control works on a mobile viewport", async ({
  22 |   browser,
  23 | }) => {
  24 |   const context = await browser.newContext({
  25 |     viewport: { width: 390, height: 844 },
  26 |     isMobile: true,
  27 |     hasTouch: true,
  28 |   });
  29 |   const page = await context.newPage();
  30 |   await page.goto("/login");
  31 | 
  32 |   const password = page.locator("#password");
  33 |   const showPassword = page.getByRole("button", { name: "Show password" });
  34 |   await showPassword.tap();
> 35 |   await expect(showPassword).toHaveAttribute("aria-pressed", "true");
     |                              ^ Error: expect(locator).toHaveAttribute(expected) failed
  36 |   await expect(password).toHaveAttribute("type", "text");
  37 |   await page.getByRole("button", { name: "Hide password" }).tap();
  38 |   await expect(password).toHaveAttribute("type", "password");
  39 |   await expect
  40 |     .poll(() =>
  41 |       page.evaluate(
  42 |         () => document.documentElement.scrollWidth <= window.innerWidth
  43 |       )
  44 |     )
  45 |     .toBe(true);
  46 |   await context.close();
  47 | });
  48 | 
  49 | test("service detail links open the selected service", async ({ page }) => {
  50 |   await page.setViewportSize({ width: 390, height: 844 });
  51 |   await page.goto("/services");
  52 | 
  53 |   const detailsLink = page.getByRole("link", { name: "Details" }).first();
  54 |   await expect(detailsLink).toBeVisible();
  55 |   await detailsLink.click();
  56 | 
  57 |   await expect(page).toHaveURL(/\/services\/[^/]+$/);
  58 |   await expect(
  59 |     page.getByRole("heading", { name: "About this service" })
  60 |   ).toBeVisible();
  61 | });
  62 | 
```