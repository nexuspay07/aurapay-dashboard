import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import { test as setup, expect } from "@playwright/test";
import { authStatePath, seedStatePath, runId } from "./fixtures/auth.js";

const require = createRequire(import.meta.url);
const mongoose = require("../../../node_modules/mongoose");
const bcrypt = require("../../../node_modules/bcrypt");
const Merchant = require("../../../models/Merchant");
const User = require("../../../models/User");
const Application = require("../../../models/Application");
const sandboxPaymentSimulationService = require("../../../services/sandboxPaymentSimulationService");
const { connectTestDatabase, disconnectTestDatabase } = require("../../../tests/helpers/testDatabase");
require("../../../node_modules/dotenv").config({ path: path.resolve("..", ".env") });

const defaultPassword = "VisualReviewPassword123!";

setup("seed sandbox merchant and authenticate through Merchant Login UI", async ({ page }) => {
  const email = `visual-review-${runId}@aurapay.test`;
  const password = process.env.AURAPAY_TEST_MERCHANT_PASSWORD || defaultPassword;

  await fs.mkdir(path.dirname(authStatePath), { recursive: true });
  await connectTestDatabase();

  const merchant = await Merchant.create({
    businessName: "AuraPay Visual Review Merchant",
    legalName: "AuraPay Visual Review Merchant LLC",
    businessType: "corporation",
    contactEmail: email,
    country: "US",
    active: true,
    verificationStatus: "verified",
    riskLevel: "low",
  });

  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    role: "merchant_owner",
    merchantId: merchant._id,
    status: "verified",
    emailVerified: true,
  });

  const application = await Application.create({
    merchant: merchant._id,
    name: "Visual Review Application",
    description: "Seeded sandbox application for visual review.",
    website: "https://example.com",
    redirectUris: ["https://example.com/auth/callback"],
    allowedOrigins: ["https://example.com"],
    environment: "sandbox",
    active: true,
  });

  const hostedSuccessCheckout =
    await sandboxPaymentSimulationService.createCheckout(
      merchant._id,
      {
        runId,
        amount: 49,
        currency: "USD",
        customerEmail: "hosted-success@example.com",
        description: "Hosted checkout visual review success scenario.",
      }
    );

  const hostedFailedCheckout =
    await sandboxPaymentSimulationService.createCheckout(
      merchant._id,
      {
        amount: 51,
        currency: "USD",
        customerEmail: "hosted-failed@example.com",
        description: "Hosted checkout visual review failed scenario.",
      }
    );

  await sandboxPaymentSimulationService.simulatePayment({
    merchant: merchant._id,
    amount: 125,
    currency: "USD",
    customerEmail: "dashboard-success@example.com",
    scenario: "success",
  });

  await sandboxPaymentSimulationService.simulatePayment({
    merchant: merchant._id,
    amount: 75,
    currency: "USD",
    customerEmail: "dashboard-declined@example.com",
    scenario: "declined",
  });

  await sandboxPaymentSimulationService.simulatePayment({
    merchant: merchant._id, amount: 80, currency: "USD",
    customerEmail: "dashboard-insufficient@example.com", scenario: "insufficient_funds",
  });

  await sandboxPaymentSimulationService.simulatePayment({
    merchant: merchant._id, amount: 90, currency: "USD",
    customerEmail: "dashboard-pending@example.com", scenario: "pending",
  });

  await fs.writeFile(
    seedStatePath,
    `${JSON.stringify(
      {
        email,
        password,
        merchantId: merchant._id.toString(),
        userId: user._id.toString(),
        applicationId: application._id.toString(),
        hostedSuccessSessionId: hostedSuccessCheckout.sessionId,
        hostedFailedSessionId: hostedFailedCheckout.sessionId,
      },
      null,
      2
    )}\n`
  );

  await page.goto("/merchant/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/merchant\/dashboard/);
  await expect(page.getByRole("heading", { name: /Dashboard/i }).first()).toBeVisible();
  await page.context().storageState({ path: authStatePath });

  await disconnectTestDatabase();
});
