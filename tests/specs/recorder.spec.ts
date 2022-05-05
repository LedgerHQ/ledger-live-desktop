/* eslint-disable jest/valid-expect */
/* eslint-disable jest/no-standalone-expect */
/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
import test from "../fixtures/common";
// import { expect } from "@playwright/test";
// import { DeviceAction } from "../models/DeviceAction";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

// Use specific userdata
// test.use({ userdata: "skip-onboarding" });

// app env
test.use({ env: { DEV_TOOLS: true, HIDE_DEBUG_MOCK: undefined, DEBUG_UPDATE: true } });

test("My test", async ({ page }) => {
  test.setTimeout(6000000);
  // const deviceAction = new DeviceAction(page);

  await page.pause();
});
