// @flow
import "./env";
import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";
import { listen as listenLogs } from "@ledgerhq/logs";
import logger from "./logger";
import "./live-common-set-supported-currencies";

listenLogs(({ id, date, ...log }) => {
  if (log.type === "hid-frame") return;
  logger.debug(log);
});
