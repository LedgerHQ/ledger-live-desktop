import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "skip-onboarding" });

process.env.PWDEBUG = "1";

test("Platform", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);
  const deviceAction = new DeviceAction(page);

  await test.step("can access the discover apps", async () => {
    console.log(process.env.SPECTRON_RUN);
    await discoverPage.navigate();
  });
});
