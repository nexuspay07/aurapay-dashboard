import {
  captureReviewScreenshot,
  expect,
  getSeedState,
  test,
  waitForPageReady,
} from "./fixtures/auth.js";

const backendURL = process.env.AURAPAY_BACKEND_URL || "http://localhost:3000";

function uniqueName(prefix) {
  return `${prefix} ${Date.now()}`;
}

async function createApiKeyInUi(page) {
  const keyName = uniqueName("Visual Flow Key");

  await page.goto("/merchant/developer/api-keys");
  await waitForPageReady(page);
  await page.getByPlaceholder("Checkout service key").fill(keyName);
  await page.getByRole("button", { name: /Full Sandbox Access/i }).click();
  await page.getByRole("button", { name: /^Create key$/i }).click();
  await expect(page.getByText("Secret key created")).toBeVisible();

  const secretPanel = page.locator("section").filter({ hasText: "Secret key created" }).first();
  await expect(secretPanel.locator("code").nth(1)).toContainText("********");
  const maskedSecret = await secretPanel.locator("code").nth(1).innerText();
  expect(maskedSecret).not.toMatch(/^sk_test_[a-f0-9]{64}$/i);

  await secretPanel.getByRole("button", { name: /Show Secret key/i }).click();
  const secret = await secretPanel.locator("code").nth(1).innerText();
  expect(secret).toMatch(/^sk_test_/);
  await secretPanel.getByRole("button", { name: /Hide Secret key/i }).click();
  await expect(secretPanel.locator("code").nth(1)).toContainText("********");
  await expect(secretPanel.locator("code").nth(1)).not.toHaveText(secret);

  return { keyName, secret };
}

test("developer API key and API Logs flow", async ({ page, request }, testInfo) => {
  const { keyName, secret } = await createApiKeyInUi(page);

  const accountRequestId = `req_visual_account_${Date.now()}`;
  const transactionsRequestId = `req_visual_transactions_${Date.now()}`;

  const accountRes = await request.get(`${backendURL}/api/v1/account`, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "X-Request-Id": accountRequestId,
    },
  });
  expect(accountRes.status()).toBe(200);

  const transactionsRes = await request.get(`${backendURL}/api/v1/transactions`, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "X-Request-Id": transactionsRequestId,
    },
  });
  expect(transactionsRes.status()).toBe(200);

  await page.goto("/merchant/developer/api-logs");
  await waitForPageReady(page);
  await page.getByPlaceholder("Search endpoint, API key, IP, request ID").fill(accountRequestId);
  await expect(page.getByText(accountRequestId).or(page.getByText("/api/v1/account"))).toBeVisible();
  await expect(page.getByText("200").first()).toBeVisible();
  await page.getByRole("button", { name: /View API log details/i }).first().click();
  await expect(page.locator("body")).not.toContainText(secret);
  await expect(page.locator("body")).not.toContainText("Authorization");

  await page.getByPlaceholder("Search endpoint, API key, IP, request ID").fill(transactionsRequestId);
  await expect(page.getByText(transactionsRequestId).or(page.getByText("/api/v1/transactions"))).toBeVisible();
  await expect(page.getByText("200").first()).toBeVisible();
  await captureReviewScreenshot(page, testInfo, "api-logs");

  await page.goto("/merchant/developer/api-keys");
  await waitForPageReady(page);
  await page.getByPlaceholder("Search keys").fill(keyName);
  await page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Rotate secret").first().click();
  await expect(page.getByText("Secret key rotated")).toBeVisible();
  await expect(page.locator("section").filter({ hasText: "Secret key rotated" }).locator("code").nth(1)).toContainText("********");

  await page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Revoke key").first().click();
  await expect(page.getByText("API key revoked.")).toBeVisible();
  await expect(page.getByText(/revoked/i).first()).toBeVisible();
  await captureReviewScreenshot(page, testInfo, "api-keys");
});

test("developer application create edit detail delete flow", async ({ page }, testInfo) => {
  const appName = uniqueName("Visual Flow Application");
  const editedName = `${appName} Edited`;

  await page.goto("/merchant/developer/applications");
  await waitForPageReady(page);
  await page.getByPlaceholder("Application name").fill(appName);
  await page.getByPlaceholder("Website").fill("https://example.com");
  await page.getByPlaceholder("Description").fill("Created by automated visual review.");
  await page.getByPlaceholder("Redirect URLs, one per line").fill("https://example.com/callback");
  await page.getByPlaceholder("Allowed origins, one per line").fill("https://example.com");
  await page.getByRole("button", { name: /^Create application$/i }).click();
  await expect(page.getByText("Application created.")).toBeVisible();
  await expect(page.getByText(appName)).toBeVisible();
  await captureReviewScreenshot(page, testInfo, "applications");

  const row = page.locator("tr").filter({ hasText: appName }).first();
  await row.getByRole("button", { name: /^Edit$/i }).click();
  await page.getByPlaceholder("Application name").fill(editedName);
  await page.getByRole("button", { name: /^Save application$/i }).click();
  await expect(page.getByText("Application updated.")).toBeVisible();
  await expect(page.getByText(editedName)).toBeVisible();

  await page.locator("tr").filter({ hasText: editedName }).first().getByRole("link", { name: /Details/i }).click();
  await waitForPageReady(page);
  await expect(page.getByRole("heading", { name: editedName })).toBeVisible();

  await page.goto("/merchant/developer/applications");
  await waitForPageReady(page);
  await page.once("dialog", (dialog) => dialog.accept());
  await page.locator("tr").filter({ hasText: editedName }).first().getByRole("button", { name: /^Delete$/i }).click();
  await expect(page.getByText("Application deleted.")).toBeVisible();
});

test("developer webhook create test retry toggle delete flow", async ({ page }, testInfo) => {
  const webhookUrl = `http://127.0.0.1:1/aurapay-visual-${Date.now()}`;

  await page.goto("/merchant/developer/webhooks");
  await waitForPageReady(page);
  await page.getByPlaceholder("https://example.com/webhooks/aurapay").fill(webhookUrl);
  await page.getByLabel("payment.completed").check();
  await page.getByRole("button", { name: /^Create webhook$/i }).click();
  await expect(page.getByText("Webhook created.")).toBeVisible();
  await expect(page.getByText("Signing secret", { exact: true })).toBeVisible();
  await expect(page.locator("section").filter({ hasText: "Signing secret" }).locator("code")).toContainText("********");
  await captureReviewScreenshot(page, testInfo, "webhooks");

  const row = page.locator("tr").filter({ hasText: webhookUrl }).first();
  await row.getByLabel("Test webhook").click();
  await expect(page.getByText("Webhook test recorded.")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /Delivery History/i })).toBeVisible();
  await expect(page.getByText(/failed|delivered/i).first()).toBeVisible();

  const retry = page.getByRole("button", { name: /^Retry$/i }).first();
  if (await retry.isVisible().catch(() => false)) {
    await retry.click();
    await expect(page.getByText("Delivery retried.")).toBeVisible({ timeout: 20_000 });
  }

  await page.locator("tr").filter({ hasText: webhookUrl }).first().getByLabel("Disable webhook").click();
  await expect(page.getByText("Webhook disabled.")).toBeVisible();
  await page.locator("tr").filter({ hasText: webhookUrl }).first().getByLabel("Enable webhook").click();
  await expect(page.getByText("Webhook enabled.")).toBeVisible();

  await page.once("dialog", (dialog) => dialog.accept());
  await page.locator("tr").filter({ hasText: webhookUrl }).first().getByLabel("Delete webhook").click();
  await expect(page.getByText("Webhook deleted.")).toBeVisible();
});
