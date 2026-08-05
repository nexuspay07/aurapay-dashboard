import {
  expect,
  expectNoHorizontalOverflow,
  test,
  waitForPageReady,
} from "./fixtures/auth.js";

const stablePages = [
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
    name: "documentation",
    path: "/merchant/developer/documentation",
    heading: /Developer Documentation/i,
  },
];

for (const pageInfo of stablePages) {
  test(`${pageInfo.name} visual snapshot @visual`, async ({ page }) => {
    await page.goto(pageInfo.path);
    await waitForPageReady(page);
    await expect(page.getByRole("heading", { name: pageInfo.heading }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(page).toHaveScreenshot(`${pageInfo.name}.png`, {
      animations: "disabled",
    });
  });
}
