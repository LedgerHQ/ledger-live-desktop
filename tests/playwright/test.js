const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");

test("basic test", async () => {
  // Launch Electron app.
  console.log("launching app");
  const electronApp = await electron.launch({
    args: ["./.webpack/main.bundle.js"],
  });

  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath();
  });
  console.log(appPath);

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  // Print the title.
  console.log(await window.title());

  // Playwright has auto wait built in, so if we want to waitUntil something has
  // loaded without performing any action(like a snapshot), we can call 'click'
  // without performing the action, by passing the option {trial: true}
  await window.click("#onboarding-get-started-button", { trial: true });
  await window.screenshot({ path: "beforeClicking.png" });

  // Getting the text from an element is messy, there's no built-in method...
  console.log(
    await window.evaluate(
      el => el.innerText.trim(),
      await window.$("#onboarding-get-started-button"),
    ),
  );
  await window.click("#onboarding-get-started-button");
  await window.screenshot({ path: "afterClicking.png" });
  // Exit app.
  await electronApp.close();

  expect(true).toBeTrue();
});
