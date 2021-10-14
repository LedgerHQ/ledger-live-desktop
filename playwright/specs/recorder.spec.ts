/* eslint-disable jest/valid-expect */
/* eslint-disable jest/no-standalone-expect */
/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
import test from "../fixtures/common";
import { expect } from "@playwright/test";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

// Use specific userdata
test.use({ userdata: "skip-onboarding" });
// electron env
test.use({ env: { MOCK: true } });

test.describe("My feature", async () => {
  test("My test", async ({ page }) => {
    await page.pause();
  });
});
