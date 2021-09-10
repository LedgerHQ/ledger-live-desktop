const { test, expect } = require("@playwright/test");
const initialize = require("./testInitialize");

test("navigate to btc", async () => {
  const electronApp = await initialize("1AccountBTC1AccountETH");
  const window = await electronApp.firstWindow();

  await window.screenshot({ path: "start-of-test.png" });
  await window.pause();

  const title = await window.isVisible("#page-scroller >> text=Bitcoin");
  expect(title).toBe(true);

  await window.screenshot({ path: "end-of-test.png" });

  await electronApp.close();
});

test("navigate to eth", async () => {
  const electronApp = await initialize("1AccountBTC1AccountETH");
  const window = await electronApp.firstWindow();

  await window.screenshot({ path: "start-of-eth-test.png" });

  await window.click("text=Accounts");
  await window.click("text=Ethereum Ethereum");
  await window.click("#page-scroller >> text=Ethereum");
  const title = await window.isVisible("#page-scroller >> text=Ethereum");
  expect(title).toBe(true);

  await window.screenshot({ path: "end-of-eth-test.png" });

  await electronApp.close();
});
