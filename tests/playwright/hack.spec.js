const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");

test("get the app running", async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({
    args: ["./.webpack/main.bundle.js"],
  });

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  // Print the title.

  const title = await window.title();
  console.log("Page title is: " + title);

  // Playwright has auto wait built in, so if we want to waitUntil something has
  // loaded without performing any action(like a snapshot), we can call 'click'
  // without performing the action, by passing the option {trial: true}
  await window.screenshot({ path: "beforeClicking.png" });

  // window.pause();

  // // Getting the text from an element is messy, there's no built-in method...
  // await console.log(
  //   await window.evaluate(
  //     el => el.innerTexelectronApp.trim(),
  //     await window.$("#onboarding-get-started-button"),
  //   ),
  // );
  await window.click("#onboarding-get-started-button");
  await window.screenshot({ path: "afterClicking.png" });

  
  // // Exit app.
  // await electronApp.close();
});
