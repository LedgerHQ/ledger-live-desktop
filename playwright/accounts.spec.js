const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");
const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");

let electronApp;

const initialize = async userData => {
  const userDataPath = path.join(__dirname, "/temp");
  if (fs.existsSync(`${userDataPath}`)) {
    rimraf.sync(userDataPath);
  }

  fs.mkdirSync(userDataPath, { recursive: true });

  if (userData) {
    const jsonFile = path.resolve("playwright/setups/", `${userData}.json`);
    fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
  }

  electronApp = await electron.launch({
    args: ["./.webpack/main.bundle.js", `--user-data-dir=${userDataPath}`],
  });
};

test("get the app running", async () => {
  await initialize("1AccountBTC1AccountETH");
  const window = await electronApp.firstWindow();

  const title = await window.title();
  console.log("Page title is: " + title);

  await window.screenshot({ path: "start-of-test.png" });

  // Click text=Accounts
  await window.click("text=Accounts");
  // assert.equal(page.url(), 'file:///Users/ggilchrist/dev/gg-lld/ledger-live-desktop/.webpack/index.html?theme=light#/accounts');
  // Click text=Bitcoin legacyBitcoin 2 (legacy)1.2809 BTC$59,111.45+ 3 % >> div
  await window.click("text=Bitcoin legacyBitcoin 2 (legacy)1.2809 BTC$59,111.45+ 3 % >> div");
  // assert.equal(page.url(), 'file:///Users/ggilchrist/dev/gg-lld/ledger-live-desktop/.webpack/index.html?theme=light#/account/mock:1:bitcoin:true_bitcoin_1:');

  await window.screenshot({ path: "start-of-test.png" });

  await electronApp.close();
});
