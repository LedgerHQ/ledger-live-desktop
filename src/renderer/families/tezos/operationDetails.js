/* eslint-disable consistent-return */
// @flow
import type { Operation } from "@ledgerhq/live-common/lib/types";

const helpURL = "https://support.ledger.com/hc/en-us/articles/360010653260";

function getURLFeesInfo(op: Operation): ?string {
  if (op.fee.gt(200000)) {
    return helpURL;
  }
}

function getURLWhatIsThis(op: Operation): ?string {
  if (op.type !== "IN" && op.type !== "OUT") {
    return helpURL;
  }
}

export default {
  getURLFeesInfo,
  getURLWhatIsThis,
};
