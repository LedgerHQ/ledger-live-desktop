// @flow
import invariant from "invariant";
import implementLibcore from "@ledgerhq/live-common/lib/libcore/platforms/nodejs";

const dbPath = process.env.LEDGER_LIVE_SQLITE_PATH;
invariant(dbPath, "process.env.LEDGER_LIVE_SQLITE_PATH required");

implementLibcore({
  lib: require("@ledgerhq/ledger-core"),
  dbPath,
});
