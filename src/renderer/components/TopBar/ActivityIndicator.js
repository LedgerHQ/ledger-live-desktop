// @flow
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useBridgeSync, useGlobalSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { useCountervaluesPolling } from "@ledgerhq/live-common/lib/countervalues/react";
import { track } from "~/renderer/analytics/segment";
import { isUpToDateSelector } from "~/renderer/reducers/accounts";
import IconLoader from "~/renderer/icons/Loader";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconCheckCircle from "~/renderer/icons/CheckCircle";
import { Rotating } from "../Spinner";
import Tooltip from "../Tooltip";
import TranslatedError from "../TranslatedError";
import Box from "../Box";
import { ItemContainer } from "./shared";

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

  const [lastClickTime, setLastclickTime] = useState(0);

  const onClick = useCallback(() => {
    cvPolling.poll();
    bridgeSync({ type: "SYNC_ALL_ACCOUNTS", priority: 5 });
    setLastclickTime(Date.now());
    track("SyncRefreshClick");
  }, [cvPolling, bridgeSync]);

  const isSpectronRun = !!process.env.SPECTRON_RUN; // we will keep 'spinning' in spectron case
  const userClickTime = isSpectronRun ? 10000 : 1000;
  const isUserClick = Date.now() - lastClickTime < userClickTime; // time to keep display the spinning on a UI click.
  const isRotating = isPending && (!isUpToDate || isUserClick);
  const isDisabled = isError || isRotating;

  const content = (
    <ItemContainer
      data-test-id="topbar-synchronize-button"
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
    >
      <Rotating
        size={16}
        isRotating={isRotating}
        color={
          isError
            ? "alertRed"
            : isRotating
            ? "palette.text.shade60"
            : isUpToDate
            ? "positiveGreen"
            : "palette.text.shade60"
        }
      >
        {isError ? (
          <IconExclamationCircle size={16} />
        ) : isRotating ? (
          <IconLoader size={16} />
        ) : isUpToDate ? (
          <IconCheckCircle size={16} />
        ) : (
          <IconExclamationCircle size={16} />
        )}
      </Rotating>
      <Box
        ml={isRotating ? 2 : 1}
        ff="Inter|SemiBold"
        color={isError ? "alertRed" : undefined}
        fontSize={4}
        horizontal
        alignItems="center"
      >
        {isRotating ? (
          <Trans i18nKey="common.sync.syncing" />
        ) : isError ? (
          <>
            <Box>
              <Trans i18nKey="common.sync.error" />
            </Box>
            <Box
              ml={2}
              style={{ textDecoration: "underline", pointerEvents: "all" }}
              onClick={onClick}
            >
              <Trans i18nKey="common.sync.refresh" />
            </Box>
          </>
        ) : isUpToDate ? (
          <span data-test-id="topbar-synchronized">
            <Trans i18nKey="common.sync.upToDate" />
          </span>
        ) : (
          <Trans i18nKey="common.sync.outdated" />
        )}
      </Box>
    </ItemContainer>
  );

  if (isError && error) {
    return (
      <Tooltip
        tooltipBg="alertRed"
        content={
          <Box fontSize={4} p={2} style={{ maxWidth: 250 }}>
            <TranslatedError error={error} />
          </Box>
        }
      >
        {content}
      </Tooltip>
    );
  }

  return content;
}
