import {
  captureReviewScreenshot,
  expect,
  expectNoHorizontalOverflow,
  expectNoRawJson,
  getSeedState,
  test,
  waitForPageReady,
} from "./fixtures/auth.js";

const publicPages = [
  {
    name: "landing",
    path: "/",
    heading: /Payments infrastructure built for modern businesses/i,
  },
  {
    name: "merchant-login",
    path: "/merchant/login",
    heading: /Merchant Login/i,
  },
  {
    name: "merchant-registration",
    path: "/merchant/register",
    heading: /Create Merchant Account/i,
  },
];

const merchantPages = [
  {
    name: "dashboard",
    path: "/merchant/dashboard",
    heading: /Dashboard/i,
    sidebar: /Dashboard/i,
  },
  {
    name: "create-checkout",
    path: "/merchant/create-checkout",
    heading: /Create Checkout/i,
  },
  {
    name: "checkouts",
    path: "/merchant/checkouts",
    heading: /Checkouts/i,
    sidebar: /Checkouts/i,
  },
  {
    name: "transactions",
    path: "/merchant/transactions",
    heading: /Transactions/i,
    sidebar: /Transactions/i,
  },
  {
    name: "settlements",
    path: "/merchant/settlements",
    heading: /Settlements/i,
    sidebar: /Settlements/i,
  },
  {
    name: "analytics",
    path: "/merchant/analytics",
    heading: /Analytics/i,
    sidebar: /Analytics/i,
  },
  {
    name: "profile",
    path: "/merchant/profile",
    heading: /Profile/i,
    sidebar: /Profile/i,
  },
  {
    name: "settings",
    path: "/merchant/settings",
    heading: /Settings/i,
    sidebar: /Settings/i,
  },
  {
    name: "api-keys",
    path: "/merchant/developer/api-keys",
    heading: /API Keys/i,
    sidebar: /API Keys/i,
  },
  {
    name: "applications",
    path: "/merchant/developer/applications",
    heading: /Applications/i,
    sidebar: /Applications/i,
  },
  {
    name: "webhooks",
    path: "/merchant/developer/webhooks",
    heading: /Webhooks/i,
    sidebar: /Webhooks/i,
  },
  {
    name: "api-logs",
    path: "/merchant/developer/api-logs",
    heading: /API Logs/i,
    sidebar: /API Logs/i,
  },
  {
    name: "documentation",
    path: "/merchant/developer/documentation",
    heading: /Developer Documentation/i,
    sidebar: /Documentation/i,
  },
];

for (const pageInfo of publicPages) {
  test(`${pageInfo.name} renders cleanly`, async ({ page }, testInfo) => {
    await page.goto(pageInfo.path);
    await waitForPageReady(page);
    await expect(page.getByRole("heading", { name: pageInfo.heading }).first()).toBeVisible();
    await expectNoRawJson(page);
    await expectNoHorizontalOverflow(page);
    await captureReviewScreenshot(page, testInfo, pageInfo.name);
  });
}

for (const pageInfo of merchantPages) {
  test(`${pageInfo.name} authenticated page renders cleanly`, async ({ page }, testInfo) => {
    await page.goto(pageInfo.path);
    await waitForPageReady(page);
    await expect(page.getByRole("heading", { name: pageInfo.heading }).first()).toBeVisible();
    if (pageInfo.sidebar) {
      await expect(page.getByRole("link", { name: pageInfo.sidebar }).first()).toBeVisible();
    }
    await expectNoRawJson(page);
    await expectNoHorizontalOverflow(page);
    await captureReviewScreenshot(page, testInfo, pageInfo.name);
  });
}

test("application detail authenticated page renders cleanly", async ({ page }, testInfo) => {
  const seed = await getSeedState();
  await page.goto(`/merchant/developer/applications/${seed.applicationId}`);
  await waitForPageReady(page);
  await expect(page.getByRole("heading", { name: /Visual Review Application|Application Details/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Applications/i }).first()).toBeVisible();
  await expectNoRawJson(page);
  await expectNoHorizontalOverflow(page);
  await captureReviewScreenshot(page, testInfo, "application-detail");
});
