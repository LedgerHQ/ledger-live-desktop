// @flow
import "./env";

import { listen as listenLogs } from "@ledgerhq/logs";
import logger from "./logger";

listenLogs(({ id, date, ...log }) => {
  if (log.type === "hid-frame") return;
  logger.debug(log);
});
