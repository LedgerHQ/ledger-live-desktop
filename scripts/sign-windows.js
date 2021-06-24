const path = require("path");
const execa = require("execa");
const chalk = require("chalk");

require("dotenv").config();

let firstCall = true;

const info = str => {
  console.log(chalk.blue(str));
};

async function azureSign(filePath) {
  const { AZURE_APP_ID, AZURE_SECRET } = process.env;

  if (!AZURE_APP_ID || !AZURE_SECRET) {
    throw new Error(
      "AZURE_APP_ID and AZURE_SECRET env variables are required for signing Windows builds.",
    );
  }

  info(`Signing ${filePath}`);

  const args = [
    "sign",
    "-du",
    "Ledger SAS",
    "-kvu",
    "https://ledgerlivevault.vault.azure.net",
    "-kvi",
    AZURE_APP_ID,
    "-kvs",
    AZURE_SECRET,
    "-kvc",
    "LL20210603-01",
    "-v",
    "-tr",
    "http://timestamp.digicert.com",
    filePath,
  ];

  await execa("azuresigntool", args, { stdio: "inherit" });
}

async function signWindows(context) {
  const filePath = context.path;

  // electron-builder normally signs Ledger Live.exe during the _building_ part, but we don't on the CI
  // this is a quick hack to have it signed during the _packing_ part
  if (firstCall) {
    firstCall = false;
    const livePath = path.resolve(__dirname, "..", "dist/win-unpacked/Ledger Live.exe");

    await azureSign(livePath);
  }

  await azureSign(filePath);
}

exports.default = signWindows;
