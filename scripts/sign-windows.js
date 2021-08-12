const execa = require("execa");
const chalk = require("chalk");

require("dotenv").config();

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

  await azureSign(filePath);
}

exports.default = signWindows;
