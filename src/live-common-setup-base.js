// @flow
import "./env";
import axios from "axios";

import { listen as listenLogs } from "@ledgerhq/logs";
import logger from "./logger";

listenLogs(({ id, date, ...log }) => {
  if (log.type === "hid-frame") return;
  logger.debug(log);
});

if (process.env.NODE_ENV === "production") {
  axios.defaults.headers.common["User-Agent"] = `Live-Desktop/${__APP_VERSION__}`;
}
