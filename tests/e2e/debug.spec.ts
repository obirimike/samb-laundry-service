import { test } from "@playwright/test";

test("debug scripts and hydration", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  page.on("requestfailed", req => console.log("REQ FAILED:", req.url(), req.failure()?.errorText));
  page.on("response", res => {
    if (res.url().includes(".js") || res.status() >= 400) {
      console.log("RES:", res.status(), res.url());
    }
  });

  await page.goto("/login");

  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("script")).map(s => ({
      src: s.src,
      type: s.type,
      async: s.async,
      defer: s.defer,
    }));
  });
  console.log("Scripts in DOM:", scripts);

  await page.waitForTimeout(3000);

  // Check if any script executed: window.__NEXT_DATA__ or React
  const globals = await page.evaluate(() => {
    return {
      hasReact: !!(window as any).React,
      hasNext: !!(window as any).__next,
      keys: Object.keys(window).filter(k => k.toLowerCase().includes("next") || k.toLowerCase().includes("react")),
    };
  });
  console.log("Window globals:", globals);

  await context.close();
});
