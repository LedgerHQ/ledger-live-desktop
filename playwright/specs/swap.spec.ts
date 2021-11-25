import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { SwapPage } from "../models/SwapPage";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });
test.use({ env: { DEV_TOOLS: true } });

test("Swap", async ({ page }) => {
  const swapPage = new SwapPage(page);

  await test.step("Open Swap Page", async () => {
    await swapPage.navigate();
    // expect(await page.screenshot()).toMatchSnapshot(`open-swap-page.png`);
  });

  await test.step("Select Max Spendable", async () => {
    await swapPage.sendMax();
    await page.pause();
  });

  await test.step("Confirm Exchange", async () => {
    await swapPage.confirmExchange();
    await page.pause();
  });
});
