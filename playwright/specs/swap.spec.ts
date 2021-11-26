import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { SwapPage } from "../models/SwapPage";
import { DeviceAction } from "../models/DeviceAction";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });
// test.use({ env: { DEV_TOOLS: true } });

test("Swap", async ({ page }) => {
  const swapPage = new SwapPage(page);
  const deviceAction = new DeviceAction(page);

  let swapId: string;
  let detailsSwapId: string;

  await test.step("Open Swap Page", async () => {
    await swapPage.navigate();
    // expect(await page.screenshot()).toMatchSnapshot(`open-swap-page.png`);
  });

  await test.step("Select Max Spendable", async () => {
    await swapPage.sendMax();
  });

  await test.step("Confirm Exchange", async () => {
    await swapPage.confirmExchange();
  });

  await test.step("Initiate swap with Nano App", async () => {
    await deviceAction.initiateSwap();
  });

  await test.step("Confirm swap with Nano App", async () => {
    await deviceAction.confirmSwap();
    await deviceAction.silentSign();
    const originalSwapId = await swapPage.verifySuccessfulExchange();
    console.log("ORIGINAL INNER TEST > " + originalSwapId);
    swapId = originalSwapId.replace("#", "");
    console.log("INNER TEST > " + swapId);
  });

  await test.step("Verify Swap details are present in the exchange drawer", async () => {
    detailsSwapId = await swapPage.verifyExchangeDetails();
    expect(detailsSwapId).toEqual(swapId);
    await page.pause();
  });
});
