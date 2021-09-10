const { test, expect } = require("@playwright/test");
const initialize = require("./testInitialize");

test("get the app running", async () => {
  const electronApp = await initialize("1AccountBTC1AccountETH");
  const window = await electronApp.firstWindow();

  const title = await window.title();
  console.log("Page title is: " + title);

  await window.screenshot({ path: "start-of-test.png" });

  // await window.pause();
  await window.screenshot({ path: "end-of-test.png" });

  await electronApp.close();
});
