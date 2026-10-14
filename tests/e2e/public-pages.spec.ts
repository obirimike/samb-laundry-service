import { expect, test } from "@playwright/test";

test("public pages render their primary content", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { name: "Professional cleaning, with care in every detail." })
  ).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "How can we help?" })).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
});
