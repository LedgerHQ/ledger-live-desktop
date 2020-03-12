// @flow

import React, { PureComponent, useContext } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useBridgeSync, useGlobalSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { track } from "~/renderer/analytics/segment";
import { isUpToDateSelector } from "~/renderer/reducers/accounts";
import CounterValues from "~/renderer/countervalues";
import IconLoader from "~/renderer/icons/Loader";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconCheckCircle from "~/renderer/icons/CheckCircle";
import { Rotating } from "../Spinner";
import Tooltip from "../Tooltip";
import TranslatedError from "../TranslatedError";
import Box from "../Box";
import ItemContainer from "./ItemContainer";

type Props = {
  error: ?Error,
  isPending: boolean,
  isError: boolean,
  isUpToDate: boolean,
  cvPoll: *,
  bridgeSync: *,
};

class ActivityIndicatorInner extends PureComponent<Props, { lastClickTime: number }> {
  state = {
    lastClickTime: 0,
  };

  onClick = () => {
    this.props.cvPoll();
    this.props.bridgeSync({ type: "SYNC_ALL_ACCOUNTS", priority: 5 });
    this.setState({ lastClickTime: Date.now() });
    track("SyncRefreshClick");
  };

  render() {
    const { isUpToDate, isPending, isError, error } = this.props;
    const { lastClickTime } = this.state;
    const isUserClick = Date.now() - lastClickTime < 1000;
    const isRotating = isPending && (!isUpToDate || isUserClick);
    const isDisabled = isError || isRotating;

    const content = (
      <ItemContainer disabled={isDisabled} onClick={isDisabled ? undefined : this.onClick}>
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
          data-e2e="syncButton"
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
                onClick={this.onClick}
              >
                <Trans i18nKey="common.sync.refresh" />
              </Box>
            </>
          ) : isUpToDate ? (
            <Trans i18nKey="common.sync.upToDate" />
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
}

const ActivityIndicator = () => {
  const bridgeSync = useBridgeSync();
  const globalSyncState = useGlobalSyncState();
  const isUpToDate = useSelector(isUpToDateSelector);
  const cvPolling = useContext(CounterValues.PollingContext);
  const isPending = cvPolling.pending || globalSyncState.pending;
  const isError = !isPending && (cvPolling.error || globalSyncState.error);
  return (
    <ActivityIndicatorInner
      isUpToDate={isUpToDate}
      isPending={isPending}
      isError={!!isError && !isUpToDate} // we only show error if it's not up to date. this hide a bit error that happen from time to time
      error={isError ? globalSyncState.error : null}
      cvPoll={cvPolling.poll}
      bridgeSync={bridgeSync}
    />
  );
};

export default ActivityIndicator;
