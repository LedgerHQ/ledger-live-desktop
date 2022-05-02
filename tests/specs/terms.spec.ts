import { expect } from "@playwright/test";

import test from "../fixtures/common";

test.use({ userdata: "skip-onboarding-with-terms" });

test("Terms of Use", async ({ page }) => {
  await test.step("check for popup", async () => {
    const modal = page.locator('[data-test-id="terms-update-popup"]');

    expect(await modal.isVisible()).toBe(true);
  });
});
