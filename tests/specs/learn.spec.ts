import { expect } from "@playwright/test";

import test from "../fixtures/common";
import { Layout } from "../models/Layout";
import { LearnPage } from "../models/LearnPage";

test.use({
  userdata: "skip-onboarding",
  remoteConfig: {
    learn: {
      enabled: true,
    },
  },
});

test("Learn", async ({ page }) => {
  const layout = new Layout(page);
  const learn = new LearnPage(page);

  await test.step("Go to learn page", async () => {
    await layout.goToLearn();
    await learn.waitForIFrame();

    expect(await page.screenshot()).toMatchSnapshot({
      name: "learn.png",
    });
  });
});
