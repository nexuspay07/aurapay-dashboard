import { test, expect } from "@playwright/test";
import { createRequire } from "module";
import path from "path";
import fs from "fs/promises";
const require = createRequire(import.meta.url);
const mongoose = require("../../../node_modules/mongoose");
const bcrypt = require("../../../node_modules/bcryptjs");
const User = require("../../../models/User");
const AuditLog = require("../../../models/AuditLog");
require("../../../node_modules/dotenv").config({ path: path.resolve("..", ".env") });

let admin, supportAdmin;
const password = "AdminPhase2Test123!";
test.beforeAll(async ({}, workerInfo) => {
  await fs.mkdir("screenshots/admin-phase2", { recursive: true });
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  const email = `admin-phase2-${Date.now()}-${workerInfo.project.name}@aurapay.test`;
  admin = await User.create({ email, password: await bcrypt.hash(password, 4), role: "super_admin", permissions: [], status: "verified", emailVerified: true });
  supportAdmin = await User.create({ email: `support-${email}`, password: await bcrypt.hash(password, 4), role: "support_admin", permissions: [], status: "verified", emailVerified: true });
});
test.afterAll(async () => {
  if (admin?._id) { await AuditLog.deleteMany({ admin: admin._id }); await User.deleteOne({ _id: admin._id, email: admin.email }); }
  if (supportAdmin?._id) { await AuditLog.deleteMany({ admin: supportAdmin._id }); await User.deleteOne({ _id: supportAdmin._id, email: supportAdmin.email }); }
  await mongoose.disconnect();
});
test.beforeEach(async ({ page, request }) => {
  const backend = process.env.AURAPAY_BACKEND_URL || "http://localhost:3000";
  const response = await request.post(`${backend}/admin-auth/login`, { data: { email: admin.email, password } });
  expect(response.ok()).toBeTruthy(); const body = await response.json();
  await page.goto("/");
  await page.evaluate(({ token, user }) => { localStorage.setItem("adminToken", token); localStorage.setItem("adminUser", JSON.stringify(user)); }, { token: body.data.token, user: body.data.admin });
});

test("all protected Admin pages share shell, navigation, identity and sandbox context", async ({ page }, testInfo) => {
  const pages = ["/admin", "/admin/merchants", "/admin/merchant-kyb", "/admin/transactions", "/admin/settlements", "/admin/users", "/admin/fraud", "/admin/audit", "/admin/analytics", "/admin/providers", "/admin/admins", "/admin/settings"];
  for (const route of pages) { await page.goto(route); await expect(page.getByTestId("admin-shell")).toBeVisible(); await expect(page.getByLabel("Admin navigation")).toBeVisible(); await expect(page.getByText(admin.email)).toBeVisible(); await expect(page.getByRole("banner").getByText("SANDBOX", { exact: true })).toBeVisible(); await expect(page.locator("main h1").first()).toBeVisible(); }
  await page.goto("/admin/transactions"); await expect(page.getByRole("link", { name: "Transactions" })).toHaveClass(/active/);
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  if (testInfo.project.name === "chromium-desktop") { await expect(page.getByText("Loading transactions…")).toBeHidden(); await page.screenshot({ path: "screenshots/admin-phase2/transactions-shell.png", fullPage: true }); }
  if (testInfo.project.name === "chromium-desktop") for (const [route, name] of [["settlements", "settlements-shell"], ["fraud", "fraud-shell"], ["admins", "admins-shell"]]) { await page.goto(`/admin/${route}`); await expect(page.getByTestId("admin-shell")).toBeVisible(); await expect(page.locator("main h1").first()).toBeVisible(); await expect(page.getByText(/Loading (settlements|fraud events|administrators)…/)).toBeHidden(); await page.screenshot({ path: `screenshots/admin-phase2/${name}.png`, fullPage: true }); }
});

test("operations overview renders canonical sections and formatted money", async ({ page }, testInfo) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Operations Command Center" })).toBeVisible();
  for (const name of ["Operational Attention", "Recent Transactions", "Settlement Snapshot", "Risk & Fraud", "Merchant Snapshot"]) await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page.getByText(/\$[\d,]+\.\d{2}|Multiple currencies/).first()).toBeVisible();
  await expect(page.getByText("Loading data…")).toHaveCount(0);
  if (testInfo.project.name === "chromium-desktop") await page.screenshot({ path: "screenshots/admin-phase2/overview-desktop.png", fullPage: true });
  if (testInfo.project.name === "chromium-tablet") await page.screenshot({ path: "screenshots/admin-phase2/overview-1024.png", fullPage: true });
});

test("deferred routes are nonblank and logout invalidates protected navigation", async ({ page }, testInfo) => {
  for (const [route, title] of [["analytics", "Analytics"], ["providers", "Providers"], ["settings", "Settings"], ["merchant-kyb", "Merchant KYB"]]) { await page.goto(`/admin/${route}`); await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible(); await expect(page.getByText(/Coming in Admin V2|Full KYB workspace/)).toBeVisible(); if (testInfo.project.name === "chromium-desktop" && route !== "merchant-kyb") await page.screenshot({ path: `screenshots/admin-phase2/${route}-placeholder.png`, fullPage: true }); }
  await page.getByRole("button", { name: "Logout" }).click(); await expect(page).toHaveURL(/admin-login/); await page.goto("/admin"); await expect(page).toHaveURL(/admin-login/);
});

test("invalid admin session redirects", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("adminToken", "invalid-token")); await page.goto("/admin"); await expect(page).toHaveURL(/admin-login/);
});

test("admin shell remains usable at 768px", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 }); await page.goto("/admin"); await expect(page.getByTestId("admin-shell")).toBeVisible(); await expect(page.getByLabel("Admin navigation")).toBeVisible(); const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth); expect(overflow).toBeFalsy();
});

test("restricted admin navigation reflects effective backend permissions", async ({ page, request }) => {
  const backend = process.env.AURAPAY_BACKEND_URL || "http://localhost:3000"; const response = await request.post(`${backend}/admin-auth/login`, { data: { email: supportAdmin.email, password } }); const body = await response.json();
  await page.evaluate(({ token, user }) => { localStorage.setItem("adminToken", token); localStorage.setItem("adminUser", JSON.stringify(user)); }, { token: body.data.token, user: body.data.admin }); await page.goto("/admin/merchants");
  await expect(page.getByRole("link", { name: "Merchants" })).toBeVisible(); await expect(page.getByRole("link", { name: "Transactions" })).toBeVisible(); await expect(page.getByRole("link", { name: "Admins" })).toHaveCount(0); await expect(page.getByRole("link", { name: "Fraud Center" })).toHaveCount(0); await expect(page.getByRole("link", { name: "Settings" })).toHaveCount(0);
});
