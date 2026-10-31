# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> service detail links open the selected service
- Location: tests\e2e\public-pages.spec.ts:65:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/services\/[^/]+$/
Received string:  "http://127.0.0.1:3000/services"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://127.0.0.1:3000/services"

```

```yaml
- banner:
  - link "SAMB's Laundry and Klinin Services homepage":
    - /url: /
    - img "SAMB's Laundry and Klinin Services logo"
    - text: SAMB'S Laundry & Klinin Services
  - group
- main:
  - text: Professional Services & Care
  - heading "Our Services" [level=1]
  - paragraph: From cleaning solutions and laundry care to dedicated domestic support and pest control, explore our full spectrum of specialized services.
  - button "All Services 20" [pressed]
  - button "Cleaning Services 9"
  - button "Laundry Care 1"
  - button "Domestic Support 5"
  - button "Pest Control 5"
  - article:
    - img "Carpet Cleaning"
    - text: Cleaning
    - heading "Carpet Cleaning" [level=3]
    - paragraph: Carpet cleaning to help remove accumulated dirt and improve cleanliness.
    - text: No reviews yet Deep fiber dirt extraction Tough stain & odor neutralizer Fast drying process
    - link "Details":
      - /url: /services/carpet-cleaning
    - link "Book":
      - /url: /book?service=e8c0374d-435f-4c12-8e6f-dbda808be2cb
  - article:
    - img "Deep Cleaning"
    - text: Cleaning
    - heading "Deep Cleaning" [level=3]
    - paragraph: Detailed cleaning for areas that need more attention than routine cleaning.
    - text: No reviews yet Behind & inside appliances Tile grout & deep scrub Baseboards, blinds & fixtures
    - link "Details":
      - /url: /services/deep-cleaning
    - link "Book":
      - /url: /book?service=9287f33d-b376-4068-85d1-08ad42877a11
  - article:
    - img "Disinfection & Sanitization"
    - text: Cleaning
    - heading "Disinfection & Sanitization" [level=3]
    - paragraph: Cleaning and sanitization services personalized to the requirements of a space.
    - text: ★★★★★ 4.0 (1 review) Hospital-grade disinfectants High-touch point fogging Safe for kids and pets
    - link "Details":
      - /url: /services/disinfection-sanitization
    - link "Book":
      - /url: /book?service=529c8c30-9cc4-4daa-929f-ac559124d741
  - article:
    - img "Move-In / Move-Out Cleaning"
    - text: Cleaning
    - heading "Move-In / Move-Out Cleaning" [level=3]
    - paragraph: Cleaning properties before moving in or after moving out.
    - text: No reviews yet Cabinets & drawer interiors Complete appliance cleaning Deposit-guarantee standards
    - link "Details":
      - /url: /services/move-in-move-out-cleaning
    - link "Book":
      - /url: /book?service=4fb72e57-3ca6-483e-861d-53e7da120627
  - article:
    - img "Post-Construction Cleaning"
    - text: Cleaning
    - heading "Post-Construction Cleaning" [level=3]
    - paragraph: Cleaning after construction or renovation to prepare a property for use.
    - text: No reviews yet Fine dust & debris removal Paint splatter & residue touch-up Move-in ready space handover
    - link "Details":
      - /url: /services/post-construction-cleaning
    - link "Book":
      - /url: /book?service=8842415c-75ec-4972-aea1-9d43586713a2
  - article:
    - img "Post-Event Cleaning"
    - text: Cleaning
    - heading "Post-Event Cleaning" [level=3]
    - paragraph: Cleaning and tidying venues after events.
    - text: No reviews yet Trash clearing & recycling Full venue restoration Fast overnight turnaround
    - link "Details":
      - /url: /services/post-event-cleaning
    - link "Book":
      - /url: /book?service=033a93d7-f6b1-400c-bfa0-350f347fe200
  - article:
    - img "Pre-Event Cleaning"
    - text: Cleaning
    - heading "Pre-Event Cleaning" [level=3]
    - paragraph: Cleaning and preparation of venues before events.
    - text: No reviews yet Venue staging & floor buffing Restroom & common area prep Welcoming, fresh ambiance
    - link "Details":
      - /url: /services/pre-event-cleaning
    - link "Book":
      - /url: /book?service=4581d143-09db-45ee-8322-7c5627804822
  - article:
    - img "Standard Cleaning"
    - text: Cleaning
    - heading "Standard Cleaning" [level=3]
    - paragraph: Routine cleaning to help maintain clean, comfortable homes and workplaces.
    - text: No reviews yet Dusting, sweeping & mopping Kitchen & bathroom sanitization Trash removal & surface tidy-up
    - link "Details":
      - /url: /services/standard-cleaning
    - link "Book":
      - /url: /book?service=00caaa3f-b5b9-4135-a449-89cb71e16549
  - article:
    - img "Upholstery Cleaning"
    - text: Cleaning
    - heading "Upholstery Cleaning" [level=3]
    - paragraph: Cleaning for upholstered furniture and other suitable fabric surfaces.
    - text: No reviews yet Fabric & leather sofas Steam & gentle shampooing Allergen & dust mite elimination
    - link "Details":
      - /url: /services/upholstery-cleaning
    - link "Book":
      - /url: /book?service=2db29c94-3bc9-40db-8c06-bc195baca86b
  - article:
    - img "Laundry Services"
    - text: Laundry Care
    - heading "Laundry Services" [level=3]
    - paragraph: Laundry services including washing, drying, folding, ironing, and fabric care.
    - text: No reviews yet Washing, drying & folding Ironing & delicate fabric care Eco-friendly, gentle detergents
    - link "Details":
      - /url: /services/laundry-services
    - link "Book":
      - /url: /book?service=d03e0d56-679a-404d-a5c7-95e7e07c6951
  - article:
    - img "Cooking and Meal Preparation"
    - text: Domestic Support
    - heading "Cooking and Meal Preparation" [level=3]
    - paragraph: Wholesome, customized home-cooked meals prepared in your kitchen according to your family's tastes, dietary plans, and agreed schedule.
    - text: No reviews yet Custom dietary & menu planning Fresh in-kitchen preparation Kitchen cleanup & food storage
    - link "Details":
      - /url: /services/cooking-meal-preparation
    - link "Book":
      - /url: /book?service=fbd0235c-3859-40bf-9c28-9818d8f3537d
  - article:
    - img "Housekeeping and General Home Maintenance"
    - text: Domestic Support
    - heading "Housekeeping and General Home Maintenance" [level=3]
    - paragraph: Comprehensive housekeeping, daily tidying, floor care, dusting, and ongoing home upkeep to maintain pristine living spaces.
    - text: No reviews yet Daily & weekly housekeeping routines Surface dusting & floor maintenance Kitchen & bathroom sanitation
    - link "Details":
      - /url: /services/housekeeping-home-maintenance
    - link "Book":
      - /url: /book?service=c15d1932-30f9-4a94-be34-fd059d10bc2b
  - article:
    - img "Laundry, Ironing, and Clothing Care"
    - text: Domestic Support
    - heading "Laundry, Ironing, and Clothing Care" [level=3]
    - paragraph: Dedicated in-home washing, precise ironing, garment pressing, wardrobe organization, and gentle clothing care.
    - text: No reviews yet Hand & machine fabric care Crisp ironing & garment steaming Wardrobe folding & organization
    - link "Details":
      - /url: /services/domestic-laundry-clothing-care
    - link "Book":
      - /url: /book?service=42bebb2c-d285-4ea1-b69b-b8b99673340d
  - article:
    - img "Provision of Domestic Helpers for Households"
    - text: Domestic Support
    - heading "Provision of Domestic Helpers for Households" [level=3]
    - paragraph: Vetted, dependable domestic helpers provided to assist with everyday household chores, routines, and family care.
    - text: No reviews yet Vetted & background-checked helpers Tailored household matching Full-time & part-time options
    - link "Details":
      - /url: /services/provision-of-domestic-helpers
    - link "Book":
      - /url: /book?service=ec38f0a8-e09d-4cc3-ba1b-942a58448fde
  - article:
    - img "Temporary and Regular Domestic Assistance"
    - text: Domestic Support
    - heading "Temporary and Regular Domestic Assistance" [level=3]
    - paragraph: Flexible domestic support tailored to your schedule, whether you need temporary emergency help, holiday assistance, or ongoing regular service.
    - text: No reviews yet Flexible shift & hours scheduling On-demand or recurring visits Reliable household task support
    - link "Details":
      - /url: /services/temporary-regular-domestic-assistance
    - link "Book":
      - /url: /book?service=8b355a2a-8bed-4bfc-9054-c203b409b547
  - article:
    - img "Cockroach, Ant, and Crawling-Insect Control"
    - text: Pest Control
    - heading "Cockroach, Ant, and Crawling-Insect Control" [level=3]
    - paragraph: Specialized eradication protocols to eliminate cockroach infestations, ant colonies, and destructive crawling insects at the root.
    - text: No reviews yet Colony eradication & baiting Nest & entry-point targeting Odorless, long-lasting defense
    - link "Details":
      - /url: /services/crawling-insect-control
    - link "Book":
      - /url: /book?service=96856aee-5834-407b-a420-b2396484e3c5
  - article:
    - img "Pest Treatment for Commercial Premises"
    - text: Pest Control
    - heading "Pest Treatment for Commercial Premises" [level=3]
    - paragraph: Industrial-grade pest control and compliant sanitation treatments tailored for warehouses, restaurants, retail outlets, and commercial buildings.
    - text: No reviews yet Health & safety regulation compliance Custom commercial pest plans Discreet after-hours servicing
    - link "Details":
      - /url: /services/commercial-pest-treatment
    - link "Book":
      - /url: /book?service=d49e6cb5-8377-407e-88fb-8ba51f9ba947
  - article:
    - img "Residential and Office Pest Control"
    - text: Pest Control
    - heading "Residential and Office Pest Control" [level=3]
    - paragraph: Targeted pest eradication treatments designed for residential homes, apartments, and corporate workspaces to keep premises pest-free.
    - text: No reviews yet Home & workplace inspections Safe, targeted treatments Minimal disruption to routine
    - link "Details":
      - /url: /services/residential-office-pest-control
    - link "Book":
      - /url: /book?service=cedad7d6-7b61-47d2-9743-e7afddd78269
  - article:
    - img "Rodent Control"
    - text: Pest Control
    - heading "Rodent Control" [level=3]
    - paragraph: Strategic rodent management utilizing secure baiting stations, humane trapping, and structural entry-point exclusion methods.
    - text: No reviews yet Secure tamper-proof bait stations Exclusion & entry-point sealing Safe disposal & sanitization
    - link "Details":
      - /url: /services/rodent-control
    - link "Book":
      - /url: /book?service=50d433a5-d5b3-40dc-9fce-07db9ccb5e28
  - article:
    - img "Scheduled Pest Prevention and Maintenance"
    - text: Pest Control
    - heading "Scheduled Pest Prevention and Maintenance" [level=3]
    - paragraph: Proactive monitoring and routine scheduled pest barrier applications to guarantee long-term protection against re-infestation.
    - text: No reviews yet Quarterly & monthly preventative plans Perimeter defense barriers Continuous inspection reports
    - link "Details":
      - /url: /services/scheduled-pest-prevention-maintenance
    - link "Book":
      - /url: /book?service=c74539b5-75f7-45f8-9e41-96e64b15d50d
  - heading "Not sure which service fits your space?" [level=2]
  - paragraph: Tell us about your requirements, schedule, or pest concerns. Our team will recommend the best solution tailored to your exact needs.
  - link "Contact our team":
    - /url: /contact
- contentinfo:
  - link "SAMB's Services Logo SAMB'S SERVICES":
    - /url: /
    - img "SAMB's Services Logo"
    - text: SAMB'S SERVICES
  - paragraph: Professional cleaning solutions with expanding laundry services. Helping homes and workplaces feel cleaner, fresher, and more comfortable.
  - heading "Explore" [level=2]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Our Services":
        - /url: /services
    - listitem:
      - link "About Us":
        - /url: /about
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - heading "Customer account" [level=2]
  - list:
    - listitem:
      - link "Create an account":
        - /url: /register
    - listitem:
      - link "Sign in":
        - /url: /login
    - listitem:
      - link "Request a service":
        - /url: /services
  - paragraph: Service prices are discussed according to the type and scope of work.
  - text: © 2026 SAMB's Laundry and Klinin Services. All rights reserved.
- alert
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
  29 | 
  30 |   const page = await context.newPage();
  31 | 
  32 |   await page.goto("/login");
  33 | 
  34 |   const password = page.locator("#password");
  35 | 
  36 |   await expect(password).toHaveAttribute("type", "password");
  37 | 
  38 |   await page.getByRole("button", { name: "Show password" }).tap();
  39 | 
  40 |   await expect(
  41 |     page.getByRole("button", { name: "Hide password" })
  42 |   ).toHaveAttribute("aria-pressed", "true");
  43 | 
  44 |   await expect(password).toHaveAttribute("type", "text");
  45 | 
  46 |   await page.getByRole("button", { name: "Hide password" }).tap();
  47 | 
  48 |   await expect(
  49 |     page.getByRole("button", { name: "Show password" })
  50 |   ).toHaveAttribute("aria-pressed", "false");
  51 | 
  52 |   await expect(password).toHaveAttribute("type", "password");
  53 | 
  54 |   await expect
  55 |     .poll(() =>
  56 |       page.evaluate(
  57 |         () => document.documentElement.scrollWidth <= window.innerWidth
  58 |       )
  59 |     )
  60 |     .toBe(true);
  61 | 
  62 |   await context.close();
  63 | });
  64 | 
  65 | test("service detail links open the selected service", async ({ page }) => {
  66 |   await page.setViewportSize({ width: 390, height: 844 });
  67 |   await page.goto("/services");
  68 | 
  69 |   const detailsLink = page.getByRole("link", { name: "Details" }).first();
  70 |   await expect(detailsLink).toBeVisible();
  71 |   await detailsLink.click();
  72 | 
> 73 |   await expect(page).toHaveURL(/\/services\/[^/]+$/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  74 |   await expect(
  75 |     page.getByRole("heading", { name: "About this service" })
  76 |   ).toBeVisible();
  77 | });
  78 | 
```