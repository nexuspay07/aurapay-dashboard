import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import { test as setup, expect } from "@playwright/test";
import { authStatePath, seedStatePath } from "./fixtures/auth.js";

const require = createRequire(import.meta.url);
const mongoose = require("../../../node_modules/mongoose");
const bcrypt = require("../../../node_modules/bcrypt");
const Merchant = require("../../../models/Merchant");
const User = require("../../../models/User");
const Application = require("../../../models/Application");
require("../../../node_modules/dotenv").config({ path: path.resolve("..", ".env") });

const defaultEmail = `visual-review-${Date.now()}@aurapay.test`;
const defaultPassword = "VisualReviewPassword123!";

setup("seed sandbox merchant and authenticate through Merchant Login UI", async ({ page }) => {
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  const email = process.env.AURAPAY_TEST_MERCHANT_EMAIL || defaultEmail;
  const password = process.env.AURAPAY_TEST_MERCHANT_PASSWORD || defaultPassword;

  if (!mongoUri) {
    throw new Error("MONGO_URI_TEST or MONGO_URI is required for visual review auth setup.");
  }

  await fs.mkdir(path.dirname(authStatePath), { recursive: true });
  await mongoose.connect(mongoUri);

  await User.deleteOne({ email });

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

  await fs.writeFile(
    seedStatePath,
    `${JSON.stringify(
      {
        email,
        password,
        merchantId: merchant._id.toString(),
        userId: user._id.toString(),
        applicationId: application._id.toString(),
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

  await mongoose.disconnect();
});
