import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { SwapPage } from "../models/SwapPage";
import { DeviceAction } from "../models/DeviceAction";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });
test.use({ env: { DEV_TOOLS: true } });

test("Swap", async ({ page }) => {
  const swapPage = new SwapPage(page);
  const deviceAction = new DeviceAction(page);

  await test.step("Open Swap Page", async () => {
    await swapPage.navigate();
    // expect(await page.screenshot()).toMatchSnapshot(`open-swap-page.png`);
  });

  await test.step("Select Max Spendable", async () => {
    await swapPage.sendMax();
    // await page.pause();
  });

  await test.step("Confirm Exchange", async () => {
    await swapPage.confirmExchange();
    // await page.pause();
  });

  await test.step("Initiate swap with Nano App", async () => {
    await deviceAction.initiateSwap();
    await page.pause();
  });

  await test.step("Confirm swap with Nano App", async () => {
    await deviceAction.confirmSwap();
    await page.pause();
  });
});

// 0x6EB963EFD0FEF7A4CFAB6CE6F1421C3279D11707
