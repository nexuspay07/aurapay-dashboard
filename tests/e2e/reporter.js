import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";
import { createRequire } from "module";
import {
  consoleErrorsPath,
  networkFailuresPath,
  reviewRoot,
  runId,
  runScreenshotRoot,
  seedStatePath,
} from "./fixtures/auth.js";

const require = createRequire(import.meta.url);
const mongoose = require("../../../node_modules/mongoose");
const ApiKey = require("../../../models/ApiKey");
const ApiLog = require("../../../models/ApiLog");
const Application = require("../../../models/Application");
const Merchant = require("../../../models/Merchant");
const MerchantWebhook = require("../../../models/MerchantWebhook");
const User = require("../../../models/User");
require("../../../node_modules/dotenv").config({ path: path.resolve("..", ".env") });

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (err) {
    return [];
  }
}

async function listScreenshots() {
  try {
    const files = await fs.readdir(runScreenshotRoot);
    return files.filter((file) => file.endsWith(".png")).sort();
  } catch (err) {
    return [];
  }
}

function getGitStatus() {
  try {
    return execSync("git status --short", {
      cwd: path.resolve(".."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (err) {
    return "Git status unavailable.";
  }
}

async function cleanupSeededData() {
  if (process.env.AURAPAY_REVIEW_KEEP_DATA === "true") {
    return "Skipped because AURAPAY_REVIEW_KEEP_DATA=true.";
  }

  try {
    const seed = JSON.parse(await fs.readFile(seedStatePath, "utf8"));
    const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

    if (!mongoUri || !seed?.merchantId) {
      return "Skipped because seed state or Mongo URI was unavailable.";
    }

    await mongoose.connect(mongoUri);
    await Promise.all([
      ApiLog.deleteMany({ merchant: seed.merchantId }),
      ApiKey.deleteMany({ merchant: seed.merchantId }),
      MerchantWebhook.deleteMany({ merchant: seed.merchantId }),
      Application.deleteMany({ merchant: seed.merchantId }),
      User.deleteMany({ merchantId: seed.merchantId }),
      Merchant.findByIdAndDelete(seed.merchantId),
    ]);
    await mongoose.disconnect();

    return "Seeded visual review data cleaned up.";
  } catch (err) {
    await mongoose.disconnect().catch(() => {});
    return `Cleanup warning: ${err.message}`;
  }
}

export default class AuraPayReviewReporter {
  async onBegin() {
    await fs.mkdir(reviewRoot, { recursive: true });
    await fs.mkdir(runScreenshotRoot, { recursive: true });
    await fs.writeFile(consoleErrorsPath, "[]\n");
    await fs.writeFile(networkFailuresPath, "[]\n");
  }

  async onEnd(result) {
    const consoleErrors = await readJson(consoleErrorsPath);
    const networkFailures = await readJson(networkFailuresPath);
    const screenshots = await listScreenshots();
    const failed = result.status !== "passed";
    const cleanupResult = await cleanupSeededData();
    const finalVerdict =
      failed || consoleErrors.length > 0 || networkFailures.length > 0
        ? "NOT READY"
        : "READY FOR VISUAL REVIEW";

    const report = [
      "# AuraPay Visual Review Summary",
      "",
      `- Timestamp: ${new Date().toISOString()}`,
      `- Run ID: ${runId}`,
      `- Frontend URL: ${process.env.AURAPAY_FRONTEND_URL || "http://localhost:5173"}`,
      `- Backend URL: ${process.env.AURAPAY_BACKEND_URL || "http://localhost:3000"}`,
      `- Playwright status: ${result.status}`,
      `- Git status:`,
      "```",
      getGitStatus() || "Clean",
      "```",
      "",
      "## Pages Tested",
      "",
      "- Landing page",
      "- Merchant login",
      "- Merchant registration",
      "- Merchant Dashboard",
      "- Create Checkout",
      "- Checkouts",
      "- Transactions",
      "- Settlements",
      "- Analytics",
      "- Profile",
      "- Settings",
      "- API Keys",
      "- Applications",
      "- Application Details",
      "- Webhooks",
      "- API Logs",
      "- Documentation",
      "",
      "## Screenshots Created",
      "",
      screenshots.length
        ? screenshots.map((file) => `- screenshots/${runId}/${file}`).join("\n")
        : "- None",
      "",
      "## Functional Tests",
      "",
      `- Passed: ${result.status === "passed" ? "Yes" : "No"}`,
      `- Failed: ${result.status === "passed" ? "No" : "Yes"}`,
      "",
      "## Console Errors",
      "",
      consoleErrors.length ? `\`\`\`json\n${JSON.stringify(consoleErrors, null, 2)}\n\`\`\`` : "- None",
      "",
      "## Network Failures",
      "",
      networkFailures.length ? `\`\`\`json\n${JSON.stringify(networkFailures, null, 2)}\n\`\`\`` : "- None",
      "",
      "## Accessibility Findings",
      "",
      "- Critical form and navigation checks are covered by role/name locators.",
      "- axe-core checks are not installed in this pass.",
      "",
      "## Responsive Findings",
      "",
      "- Tests assert no horizontal overflow on desktop, tablet, and mobile projects.",
      "",
      "## Secrets Exposure Check",
      "",
      "- API key and webhook screenshots assert full secrets are not visible.",
      "- Console/network artifacts sanitize Authorization, Cookie, and API key headers.",
      "",
      "## Cleanup",
      "",
      `- ${cleanupResult}`,
      "",
      `## Final Verdict: ${finalVerdict}`,
      "",
    ].join("\n");

    await fs.writeFile(path.join(reviewRoot, "summary.md"), report);
  }
}
