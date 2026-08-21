import { test, expect } from "./fixtures/auth";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Merchant = require("../../../models/Merchant");
const User = require("../../../models/User");
const { assertSafeDestructiveOperation, connectTestDatabase, disconnectTestDatabase } = require("../../../tests/helpers/testDatabase");
const createdEmails = [];

test.beforeAll(async () => { await connectTestDatabase(); });
test.afterAll(async () => {
  assertSafeDestructiveOperation();
  const users = await User.find({ email: { $in: createdEmails } }).select("_id merchantId");
  await User.deleteMany({ _id: { $in: users.map((user) => user._id) } });
  await Merchant.deleteMany({ _id: { $in: users.map((user) => user.merchantId).filter(Boolean) } });
  await disconnectTestDatabase();
});

test("public Sandbox merchant can register, verify, sign in, reset password, and sign out", async ({ page }, testInfo) => {
  const suffix = `${Date.now()}-${testInfo.project.name}`.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const ownerEmail = `onboarding-${suffix}@aurapay.test`;
  const businessEmail = `business-${suffix}@aurapay.test`;
  const oldPassword = "SandboxOwner123!";
  const newPassword = "SandboxOwner456!";
  createdEmails.push(ownerEmail);

  await page.goto("/");
  await page.locator('a[href="/merchant/register"]:visible').first().click();
  await expect(page).toHaveURL(/merchant\/register/);
  await page.getByLabel("Business name").fill(`Onboarding ${suffix}`);
  await page.getByLabel("Legal name").fill(`Onboarding ${suffix} Inc`);
  await page.getByLabel("Business email").fill(businessEmail);
  await page.getByLabel("Owner email").fill(ownerEmail);
  await page.getByLabel("Password").fill(oldPassword);
  const registrationResponse = page.waitForResponse((response) => response.url().endsWith("/merchants/register") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Create Sandbox account" }).click();
  const registration = await (await registrationResponse).json();
  await expect(page.getByRole("heading", { name: /check your email/i })).toBeVisible();
  expect(registration.data.emailDelivery).toBe("pending");
  expect(registration.data.developmentVerificationLink).toBeTruthy();

  await page.goto(registration.data.developmentVerificationLink);
  await expect(page.getByRole("heading", { name: "You are verified" })).toBeVisible();
  await page.getByRole("link", { name: "Go to Sign In" }).click();
  await page.getByPlaceholder("Email").fill(ownerEmail.toUpperCase());
  await page.getByPlaceholder("Password").fill(oldPassword);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page).toHaveURL(/merchant\/dashboard/);
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/forgot-password");
  await page.getByLabel("Email address").fill(` ${ownerEmail.toUpperCase()} `);
  const forgotResponse = page.waitForResponse((response) => response.url().endsWith("/auth/forgot-password") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Send reset link" }).click();
  const forgot = await (await forgotResponse).json();
  await expect(page.getByRole("status")).toContainText("If an account exists");
  expect(forgot.developmentResetLink).toBeTruthy();
  await page.goto(forgot.developmentResetLink);
  await page.getByLabel("New password").fill(newPassword);
  await page.getByRole("textbox", { name: "Confirm password" }).fill(newPassword);
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(page.getByRole("status")).toContainText("password has been reset");
  await page.goto("/merchant/login");
  await page.getByPlaceholder("Email").fill(ownerEmail);
  await page.getByPlaceholder("Password").fill(oldPassword);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByPlaceholder("Password").fill(newPassword);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page).toHaveURL(/merchant\/dashboard/);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/merchant\/login/);
});

test("verification errors and resend remain usable without account enumeration", async ({ page }) => {
  await page.goto("/verify-email/not-a-real-token");
  await expect(page.getByRole("heading", { name: /could not verify/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Request a new link" })).toBeVisible();
  await page.goto("/resend-verification-email");
  await page.getByLabel("Email address").fill(`missing-${Date.now()}@aurapay.test`);
  await page.getByRole("button", { name: "Resend verification email" }).click();
  await expect(page.getByRole("status")).toContainText("If an eligible account exists");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
