import { expect, expectNoHorizontalOverflow, test, waitForPageReady } from "./fixtures/auth.js";

async function inspect(page, email) {
  await page.goto("/merchant/transactions");
  await waitForPageReady(page);
  const row = page.getByRole("row").filter({ hasText: email });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: /Inspect payment/i }).click();
  await expect(page).toHaveURL(/\/merchant\/transactions\//);
  await expect(page.getByRole("heading", { name: "Transaction timeline" })).toBeVisible();
  await expect(page.getByText("SANDBOX · NO REAL FUNDS")).toBeVisible();
  await expectNoHorizontalOverflow(page);
}

test("successful transaction opens an evidence-based inspector", async ({ page }) => {
  await inspect(page, "dashboard-success@example.com");
  await expect(page.getByText("COMPLETED — PAYMENT COMPLETED")).toBeVisible();
  await expect(page.getByText("Settlement created", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Developer details" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/sk_test_|whsec_|Authorization: Bearer/i);
  await page.getByRole("link", { name: /Back to transactions/i }).focus();
  await expect(page.getByRole("link", { name: /Back to transactions/i })).toBeFocused();
});

test("failure and pending inspectors explain their sandbox outcomes", async ({ page }) => {
  await inspect(page, "dashboard-declined@example.com");
  await expect(page.getByText("FAILED — CARD DECLINED")).toBeVisible();
  const declinedOutcome = page.getByRole("region", { name: "Why did this payment fail?" });
  await expect(declinedOutcome.getByText(/No real issuer was contacted/i)).toBeVisible();
  await expect(page.getByRole("region", { name: "Transaction timeline" })
    .getByText("Settlement not created", { exact: true })).toBeVisible();

  await inspect(page, "dashboard-insufficient@example.com");
  await expect(page.getByText("FAILED — INSUFFICIENT FUNDS")).toBeVisible();
  const insufficientOutcome = page.getByRole("region", { name: "Why did this payment fail?" });
  await expect(insufficientOutcome.getByText(/simulated available funds were insufficient/i)).toBeVisible();

  await inspect(page, "dashboard-pending@example.com");
  await expect(page.getByText("PENDING — PAYMENT PROCESSING")).toBeVisible();
  await expect(page.getByRole("region", { name: "Payment status" })
    .getByText(/No real funds are moving/i)).toBeVisible();
  await expect(page.getByRole("region", { name: "Transaction timeline" })
    .getByText("Settlement not created yet", { exact: true })).toBeVisible();
});
