import { defineConfig, devices } from "@playwright/test";

const frontendURL = process.env.AURAPAY_FRONTEND_URL || "http://localhost:5173";
const backendURL = process.env.AURAPAY_BACKEND_URL || "http://localhost:3000";
const frontendPort = new URL(frontendURL).port || "5173";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
    },
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["./tests/e2e/reporter.js"],
  ],
  use: {
    baseURL: frontendURL,
    actionTimeout: 12_000,
    navigationTimeout: 20_000,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
  },
  webServer: [
    {
      command: "node server.js",
      cwd: "..",
      url: `${backendURL}/health`,
      reuseExistingServer: true,
      timeout: 90_000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: `npm.cmd run dev -- --host localhost --port ${frontendPort}`,
      cwd: ".",
      url: frontendURL,
      reuseExistingServer: true,
      timeout: 90_000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-desktop",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: "tests/e2e/.auth/merchant.json",
      },
    },
    {
      name: "chromium-tablet",
      dependencies: ["setup"],
      testIgnore: [/auth\.setup\.js/, /developer-flows\.spec\.js/, /visual-regression\.spec\.js/],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
        storageState: "tests/e2e/.auth/merchant.json",
      },
    },
    {
      name: "chromium-mobile",
      dependencies: ["setup"],
      testIgnore: [/auth\.setup\.js/, /developer-flows\.spec\.js/, /visual-regression\.spec\.js/],
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
        storageState: "tests/e2e/.auth/merchant.json",
      },
    },
  ],
  metadata: {
    frontendURL,
    backendURL,
  },
});
