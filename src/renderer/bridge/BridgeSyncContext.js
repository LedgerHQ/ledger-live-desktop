// @flow

import React, { useCallback, useEffect, useRef } from "react";
import { BridgeSync } from "@ledgerhq/live-common/lib/bridge/react";
import { toAccountRaw } from "@ledgerhq/live-common/lib/account";
import { useSelector, useDispatch } from "react-redux";
import logger from "~/logger";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { recentlyChangedExperimental } from "~/renderer/experimental";
import { recentlyKilledInternalProcess } from "~/renderer/reset";
import { track } from "~/renderer/analytics/segment";
import { prepareCurrency, hydrateCurrency } from "./cache";
import { hasOngoingSync } from "./proxy";
import { blacklistedTokenIdsSelector } from "~/renderer/reducers/settings";
import { command } from "~/renderer/commands";

export const BridgeSyncProvider = ({ children }: { children: React$Node }) => {
  const accounts = useSelector(accountsSelector);
  const accountsRef = useRef(accounts);
  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);
  const dispatch = useDispatch();
  const updateAccount = useCallback(
    (accountId, updater) => dispatch(updateAccountWithUpdater(accountId, updater)),
    [dispatch],
  );

  // during ongoing sync, if an account is changed, we inform the internal process of its latest state to the sync can properly reconciliate
  useEffect(() => {
    accounts.forEach(account => {
      const prev = accountsRef.current.find(a => a.id === account.id);
      if (prev !== account && hasOngoingSync(account.id)) {
        command("AccountSyncSet")({ account: toAccountRaw(account) }).subscribe();
      }
    });
    accountsRef.current = accounts;
  }, [accounts]);

  const recoverError = useCallback(error => {
    const isInternalProcessError = error && error.message.includes("Internal process error");
    if (
      isInternalProcessError &&
      (recentlyKilledInternalProcess() || recentlyChangedExperimental())
    ) {
      // This error is normal because the thread was recently killed. we silent it for the user.
      return;
    }
    logger.critical(error);
    return error;
  }, []);

  return (
    <BridgeSync
      accounts={accounts}
      updateAccountWithUpdater={updateAccount}
      recoverError={recoverError}
      trackAnalytics={track}
      prepareCurrency={prepareCurrency}
      hydrateCurrency={hydrateCurrency}
      blacklistedTokenIds={blacklistedTokenIds}
    >
      {children}
    </BridgeSync>
  );
};
