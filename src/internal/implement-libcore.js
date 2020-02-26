// @flow
import invariant from "invariant";
import implementLibcore from "@ledgerhq/live-common/lib/libcore/platforms/nodejs";
import { withLibcore } from "@ledgerhq/live-common/lib/libcore/access";

export const changePassword = async (currentPassword: string, newPassword: string) => {
  withLibcore(async core => core.getPoolInstance().changePassword(currentPassword, newPassword));
};

export default async (dbPassword: string) => {
  const dbPath = process.env.LEDGER_LIVE_SQLITE_PATH;
  invariant(dbPath, "process.env.LEDGER_LIVE_SQLITE_PATH required");

  implementLibcore({
    lib: require("@ledgerhq/ledger-core"),
    dbPath,
    dbPassword,
  });

  // The following line will consistently crash if the password is wrong.
  // We rather crash now and know right away libcore is unusable (until the correct password is set)
  await withLibcore(async core => core.getPoolInstance().getName());

  invariant(process.send, "Internal has no IPC channel! (process.send is missing)");
  process.send({ type: "libcoreInitialized" }); // We didn't crash 🎉
};
