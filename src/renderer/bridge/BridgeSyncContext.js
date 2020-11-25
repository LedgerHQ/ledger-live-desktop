// @flow

import React, { useCallback } from "react";
import { BridgeSync } from "@ledgerhq/live-common/lib/bridge/react";
import { useSelector, useDispatch } from "react-redux";
import logger from "~/logger";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { recentlyChangedExperimental } from "~/renderer/experimental";
import { recentlyKilledInternalProcess, onUnusualInternalProcessError } from "~/renderer/reset";
import { track } from "~/renderer/analytics/segment";
import { prepareCurrency, hydrateCurrency } from "./cache";
import { blacklistedTokenIdsSelector } from "~/renderer/reducers/settings";

export const BridgeSyncProvider = ({ children }: { children: React$Node }) => {
  const accounts = useSelector(accountsSelector);
  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);
  const dispatch = useDispatch();
  const updateAccount = useCallback(
    (accountId, updater) => dispatch(updateAccountWithUpdater(accountId, updater)),
    [dispatch],
  );

  const recoverError = useCallback(error => {
    const isInternalProcessError = error && error.message.includes("Internal process error");
    if (
      isInternalProcessError &&
      (recentlyKilledInternalProcess() || recentlyChangedExperimental())
    ) {
      // This error is normal because the thread was recently killed. we silent it for the user.
      return;
    }
    if (isInternalProcessError) {
      onUnusualInternalProcessError();
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
