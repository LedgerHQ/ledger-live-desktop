const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");
const { options } = require("yargs");

test("get the app running", async () => {
  const electronApp = await electron.launch({
    args: ["./.webpack/main.bundle.js"],
  });

  console.log("about to check for window")

  const window = await electronApp.firstWindow();

  const title = await window.title();
  console.log("Page title is: " + title);

  await window.screenshot({ path: "start-of-test.png" });

  await window.waitForSelector('#__app__ready__', { state: 'attached'});

  await window.waitForLoadState('domcontentloaded');

  // await window.waitForSelector('button#onboarding-get-started-button', { state: 'visible'});

  const button = await window.$('#onboarding-get-started-button');
  console.log("buttonText: " + await button.innerHTML());
  await button.isEnabled();

  await window.click("button#onboarding-get-started-button");
  await window.screenshot({ path: "afterClicking.png" });

  // await window.pause();
  await window.click("#onboarding-terms-check");
  await window.click('button:has-text("Enter Ledger app")');
  await window.click('button:has-text("Nano S")');
  await window.click('button:has-text("Connect deviceConnect your Nano SIs your device already set up? Connect it to th")');
  await window.click('button:has-text("Check my Nano")');

  await window.screenshot({ path: "end-of-test.png" });
  // await window.pause();

  const connectNanoCTA = await window.isVisible("text=Connect and unlock your device");
  expect(connectNanoCTA).toBe(true);
  // expect.t
  await electronApp.close();
});
