const platform = require("os").platform();
const { notarize } = require("electron-notarize");
const chalk = require("chalk");

require("dotenv").config();
require("debug").enable("electron-notarize");

const info = str => {
  console.log(chalk.blue(str));
};

async function notarizeApp(context) {
  if (platform !== "darwin") {
    info("OS is not mac, skipping notarization.");
    return;
  }

  info(
    "Don't mind electron-builder error 'Cannot find module 'scripts/notarize.js', it definitively found me",
  );

  const { APPLEID, APPLEID_PASSWORD, DEVELOPER_TEAM_ID } = process.env;

  if (!APPLEID || !APPLEID_PASSWORD) {
    throw new Error("APPLEID and APPLEID_PASSWORD env variable are required for notarization.");
  }

  const { appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;
  const path = `${appOutDir}/${appName}.app`;

  if (!DEVELOPER_TEAM_ID) {
    await notarize({
      appBundleId: "com.ledger.live",
      appPath: path,
      ascProvider: "EpicDreamSAS",
      appleId: APPLEID,
      appleIdPassword: APPLEID_PASSWORD,
    });
  } else {
    await notarize({
      tool: "notarytool",
      appBundleId: "com.ledger.live",
      appPath: path,
      ascProvider: "EpicDreamSAS",
      appleId: APPLEID,
      teamId: DEVELOPER_TEAM_ID,
      appleIdPassword: APPLEID_PASSWORD,
    });
  }
}

exports.default = notarizeApp;
