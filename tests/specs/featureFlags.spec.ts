import { expect } from "@playwright/test";

import test from "../fixtures/common";
import { Layout } from "../models/Layout";

test.use({ userdata: "skip-onboarding" });

test("Feature flags", async ({ page }) => {
  const layout = new Layout(page);

  await test.step("Learn button shouldn't exist", async () => {
    expect(layout.drawerLearnButton).toHaveCount(0);
  });
});
