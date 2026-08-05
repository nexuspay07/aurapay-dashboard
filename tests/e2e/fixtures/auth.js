import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import { test as base, expect } from "@playwright/test";

export const reviewRoot = path.resolve("review-output");
export const screenshotRoot = path.join(reviewRoot, "screenshots");
const runIdPath = path.join(reviewRoot, ".run-id");

function createRunId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function resolveRunId() {
  if (process.env.AURAPAY_REVIEW_RUN_ID) {
    return process.env.AURAPAY_REVIEW_RUN_ID;
  }

  try {
    return fsSync.readFileSync(runIdPath, "utf8").trim();
  } catch (err) {
    const nextRunId = createRunId();
    fsSync.mkdirSync(reviewRoot, { recursive: true });
    fsSync.writeFileSync(runIdPath, `${nextRunId}\n`);
    return nextRunId;
  }
}

export const runId = resolveRunId();
export const runScreenshotRoot = path.join(screenshotRoot, runId);
export const consoleErrorsPath = path.join(reviewRoot, "console-errors.json");
export const networkFailuresPath = path.join(reviewRoot, "network-failures.json");
export const authStatePath = path.resolve("tests/e2e/.auth/merchant.json");
export const seedStatePath = path.resolve("tests/e2e/.auth/seed.json");

const allowedWarningPatterns = [
  /React Router Future Flag Warning/i,
  /Stripe\.js integration over HTTP/i,
];

const sensitiveHeaderNames = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
]);

async function ensureReviewFolders() {
  await fs.mkdir(runScreenshotRoot, { recursive: true });
}

async function appendJson(filePath, record) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let records = [];

  try {
    records = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (err) {
    records = [];
  }

  records.push(record);
  await fs.writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`);
}

function sanitizeHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).filter(([name]) => !sensitiveHeaderNames.has(name.toLowerCase()))
  );
}

function isCriticalRequest(url) {
  return [
    "/auth/",
    "/merchant/",
    "/merchant-analytics",
    "/checkout-ops",
    "/api/v1",
  ].some((part) => url.includes(part));
}

export async function getSeedState() {
  return JSON.parse(await fs.readFile(seedStatePath, "utf8"));
}

export function safeScreenshotName(name, projectName) {
  return `${name}-${projectName.replace(/^chromium-/, "")}.png`;
}

export async function captureReviewScreenshot(page, testInfo, name) {
  await ensureReviewFolders();
  const fileName = safeScreenshotName(name, testInfo.project.name);
  const fullPath = path.join(runScreenshotRoot, fileName);
  await page.screenshot({
    path: fullPath,
    fullPage: true,
    animations: "disabled",
  });
  testInfo.attachments.push({
    name: `screenshot:${fileName}`,
    contentType: "image/png",
    path: fullPath,
  });
  return fullPath;
}

export async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });

  expect(overflow, "page should not have horizontal overflow").toBe(false);
}

export async function expectNoRawJson(page) {
  const body = await page.locator("body").innerText();
  expect(body, "page should not render raw JSON payloads").not.toMatch(/^\s*\{[\s\S]*"success"\s*:/);
}

export async function waitForPageReady(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.locator("body").waitFor({ state: "visible" });
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await ensureReviewFolders();

    const consoleErrors = [];
    const networkFailures = [];

    page.on("pageerror", async (error) => {
      const record = {
        test: testInfo.title,
        project: testInfo.project.name,
        type: "pageerror",
        message: error.message,
      };
      consoleErrors.push(record);
      await appendJson(consoleErrorsPath, record);
    });

    page.on("console", async (message) => {
      if (message.type() !== "error") {
        const text = message.text();
        const isAllowed = allowedWarningPatterns.some((pattern) => pattern.test(text));
        if (message.type() === "warning" && !isAllowed) {
          const record = {
            test: testInfo.title,
            project: testInfo.project.name,
            type: "warning",
            text,
            location: message.location(),
          };
          await appendJson(consoleErrorsPath, record);
        }
        return;
      }

      const record = {
        test: testInfo.title,
        project: testInfo.project.name,
        type: "console.error",
        text: message.text(),
        location: message.location(),
      };
      consoleErrors.push(record);
      await appendJson(consoleErrorsPath, record);
    });

    page.on("requestfailed", async (request) => {
      if (!isCriticalRequest(request.url())) {
        return;
      }

      const record = {
        test: testInfo.title,
        project: testInfo.project.name,
        type: "requestfailed",
        method: request.method(),
        url: request.url(),
        failure: request.failure()?.errorText || "Request failed",
        headers: sanitizeHeaders(request.headers()),
      };
      networkFailures.push(record);
      await appendJson(networkFailuresPath, record);
    });

    page.on("response", async (response) => {
      if (!isCriticalRequest(response.url())) {
        return;
      }

      if (response.status() >= 500) {
        const record = {
          test: testInfo.title,
          project: testInfo.project.name,
          type: "server-error",
          method: response.request().method(),
          url: response.url(),
          status: response.status(),
          headers: sanitizeHeaders(response.request().headers()),
        };
        networkFailures.push(record);
        await appendJson(networkFailuresPath, record);
      }
    });

    await use(page);

    expect(consoleErrors, "no uncaught page errors or console.error").toEqual([]);
    expect(networkFailures, "no failed critical API requests or 500 responses").toEqual([]);
  },
});

export { expect };
