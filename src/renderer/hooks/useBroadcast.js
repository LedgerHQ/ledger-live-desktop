// @flow
import invariant from "invariant";
import { useCallback } from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  SignedOperation,
  Operation,
  AccountLike,
  Account,
} from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { execAndWaitAtLeast } from "@ledgerhq/live-common/lib/promise";
import { getEnv } from "@ledgerhq/live-common/lib/env";

type SignTransactionArgs = {
  account: ?AccountLike,
  parentAccount: ?Account,
};

export const useBroadcast = ({ account, parentAccount }: SignTransactionArgs) => {
  const broadcast = useCallback(
    async (signedOperation: SignedOperation): Promise<Operation> => {
      invariant(account, "account not present");
      const mainAccount = getMainAccount(account, parentAccount);
      const bridge = getAccountBridge(account, parentAccount);

      if (getEnv("DISABLE_TRANSACTION_BROADCAST")) {
        return Promise.resolve(signedOperation.operation);
      }

      return execAndWaitAtLeast(3000, () =>
        bridge.broadcast({
          account: mainAccount,
          signedOperation,
        }),
      );
    },
    [account, parentAccount],
  );

  return broadcast;
};
