#!/usr/bin/env node

const platform = require("os").platform();
const path = require("path");
const fs = require("fs").promises;
const chalk = require("chalk");
const execa = require("execa");
const rimraf = require("rimraf");

const info = str => {
  console.log(chalk.blue(str));
};

const rm = fullPath =>
  new Promise((resolve, reject) => {
    rimraf(fullPath, error => {
      if (error) return reject(error);
      resolve();
    });
  });

async function uninstaller(buildResult) {
  if (platform !== "win32") {
    info("OS is not Windows, skipping extracting uninstaller.");
    return;
  }

  info(
    "Don't pay attention to electron-builder error `Cannot find module 'scripts/extract-uninstaller.js'`, it definitively found me",
  );

  info("Extracting uninstaller from installer exe");

  const { outDir, artifactPaths } = buildResult;
  const installerPath = artifactPaths.filter(p => p.endsWith(".exe"))[0];
  const uninstallerName = "Uninstall Ledger Live.exe";
  const uninstallerPath = path.join(outDir, uninstallerName);

  try {
    // rm any leftover, as 7z doesn't error or even warn if the target file exists already
    await rm(uninstallerPath);

    // `node-7z-archive` *should* work as a node module to handle this, but it's not.
    //  So let's skip the wrapper and directly call the win32 7z binary it comes with.
    // (other better maintained npm packages exist, but they only offer the lighter `7za` which doesn't handle NSIS)
    await execa("./node_modules/node-7z-archive/binaries/win32/7z", [
      "e",
      installerPath,
      uninstallerName,
      "-o" + outDir,
    ]);

    // Check if the uninstaller now exists
    await fs.stat(uninstallerPath);

    info(`'${uninstallerName}' successfully extracted from '${installerPath}'.`);
  } catch (error) {
    console.error("Uninstaller extracting failed:");
    console.error(`Unable to extract '${uninstallerName}' from '${installerPath}'.`);
    console.error(error);

    throw new Error("Uninstaller extraction failed");
  }

  // Add the uninstaller to the files to publish
  return [uninstallerPath];
}

exports.default = uninstaller;
