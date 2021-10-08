import test from "../fixtures/start";
import { expect } from "@playwright/test";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

// Use specific userdata
test.use({ userdata: "skip-onboarding" });

test.describe("My feature", async () => {
  test.beforeAll(async () => {
    console.log("Before tests");
  });

  test.afterAll(async () => {
    console.log("After tests");
  });

  test("My test", async ({ page }) => {
    // await page.pause();
    expect(await page.title()).toBe("Ledger Live");
    console.log("------------> test complete")
    // await page.screenshot({ path: "screenshots/screenshot.png" });
  });
});
