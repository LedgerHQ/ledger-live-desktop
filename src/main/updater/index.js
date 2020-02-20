// @flow
import logger from "~/logger";

let updater: { quitAndInstall?: () => void } = {};

export default (type: string) => {
  console.log(type);
  switch (type) {
    case "init":
      updater = require("./init").default;
      break;

    case "quit-and-install":
      if (!updater.quitAndInstall) {
        logger.error(`Auto-update error: quitAndInstall called before init`);
      } else {
        updater.quitAndInstall();
      }
      break;

    default:
      logger.error(`Unknown updater message type: ${type}`);
      break;
  }
};
