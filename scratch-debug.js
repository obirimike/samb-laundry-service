const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGEERROR:", err));

  console.log("Navigating to /login...");
  await page.goto("http://127.0.0.1:3000/login");

  const btn = page.getByRole("button", { name: "Show password" });
  console.log("Button before tap:", await btn.evaluate(el => el.outerHTML));

  // Check if React listeners or event listeners are present
  const listeners = await btn.evaluate(el => {
    return {
      hasOnClick: !!el.onclick,
      attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`),
    };
  });
  console.log("Button info:", listeners);

  console.log("Tapping button...");
  await btn.tap();

  await page.waitForTimeout(500);
  console.log("Button after tap (checking by locator #password parent button):");
  const currentBtnHtml = await page.evaluate(() => {
    const b = document.querySelector("#password")?.parentElement?.querySelector("button");
    return b ? b.outerHTML : "none";
  });
  console.log("Current button in DOM:", currentBtnHtml);

  await browser.close();
}

run().catch(console.error);
