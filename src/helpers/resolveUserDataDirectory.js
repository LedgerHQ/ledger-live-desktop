// @flow

const resolveUserDataDirectory = () => {
  const { LEDGER_CONFIG_DIRECTORY } = process.env;
  if (LEDGER_CONFIG_DIRECTORY) return LEDGER_CONFIG_DIRECTORY;
  const electron = require("electron");
  return (electron.app || electron.remote.app).getPath("userData");
};

export default resolveUserDataDirectory;
