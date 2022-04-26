// @flow
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useBridgeSync, useGlobalSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { useCountervaluesPolling } from "@ledgerhq/live-common/lib/countervalues/react";
import { track } from "~/renderer/analytics/segment";
import { isUpToDateSelector } from "~/renderer/reducers/accounts";
import { Button, InfiniteLoader, Icons, Flex, Text, Tooltip } from "@ledgerhq/react-ui";

import TranslatedError from "../TranslatedError";

export default function ActivityIndicatorInner() {
  const bridgeSync = useBridgeSync();
  const globalSyncState = useGlobalSyncState();
  const isUpToDate = useSelector(isUpToDateSelector);
  const cvPolling = useCountervaluesPolling();
  const isPending = cvPolling.pending || globalSyncState.pending;
  const syncError = !isPending && (cvPolling.error || globalSyncState.error);
  // we only show error if it's not up to date. this hide a bit error that happen from time to time
  const isError = !!syncError && !isUpToDate;
  const error = syncError ? globalSyncState.error : null;

  const { t } = useTranslation();

  const [lastClickTime, setLastclickTime] = useState(0);

  const resyncAccounts = useCallback(() => {
    cvPolling.poll();
    bridgeSync({ type: "SYNC_ALL_ACCOUNTS", priority: 5 });
    setLastclickTime(Date.now());
    track("SyncRefreshClick");
  }, [cvPolling, bridgeSync]);

  const isSpectronRun = !!process.env.SPECTRON_RUN; // we will keep 'spinning' in spectron case
  const userClickTime = isSpectronRun ? 10000 : 1000;
  const isUserClick = Date.now() - lastClickTime < userClickTime; // time to keep display the spinning on a UI click.
  const isRotating = isPending && (!isUpToDate || isUserClick);
  const isDisabled = isRotating;

  const icon = () =>
    isRotating ? (
      <InfiniteLoader />
    ) : isError ? (
      <Icons.CircledCrossMedium color="palette.error.c100" />
    ) : isUpToDate ? (
      <Icons.CircledCheckMedium color="palette.success.c100" />
    ) : (
      <Icons.CircledAlertMedium color="palette.neutral.c70" />
    );

  const content = (
    <Button Icon={icon} onClick={() => isDisabled || resyncAccounts()} iconPosition="left">
      <Flex ml={isRotating ? 2 : 1} color={isError ? "alertRed" : undefined} alignItems="center">
        {isRotating ? (
          <Text>{t("common.sync.syncing")}</Text>
        ) : isError ? (
          <Flex columnGap={5}>
            <Text color="palette.error.c100">{t("common.sync.error")}</Text>
            <Text>{t("common.sync.refresh")}</Text>
          </Flex>
        ) : isUpToDate ? (
          <Text color="palette.success.c100">{t("common.sync.upToDate")}</Text>
        ) : (
          <Text>{t("common.sync.outdated")}</Text>
        )}
      </Flex>
    </Button>
  );

  if (isError && error) {
    return <Tooltip content={<TranslatedError error={error} field="title" />}>{content}</Tooltip>;
  }

  return content;
}
