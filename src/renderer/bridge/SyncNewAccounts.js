// @flow

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useBridgeSync } from "@ledgerhq/live-common/lib/bridge/react";
import { accountsSelector } from "../reducers/accounts";

export const SyncNewAccounts = ({ priority }: { priority: number }) => {
  const ids = useSelector(accountsSelector).map(a => a.id);
  const ref = useRef(ids);
  const sync = useBridgeSync();

  useEffect(() => {
    const accountIds = ids.filter(a => !ref.current.includes(a));
    ref.current = accountIds;
    if (accountIds.length > 0) {
      sync({
        type: "SYNC_SOME_ACCOUNTS",
        accountIds,
        priority,
      });
    }
  }, [ids, sync, priority]);

  return null;
};
