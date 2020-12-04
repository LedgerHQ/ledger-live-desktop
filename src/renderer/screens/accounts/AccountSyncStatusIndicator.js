// @flow

import React, { PureComponent, useCallback, useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useBridgeSync, useAccountSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";

import Box from "~/renderer/components/Box";
import { Rotating } from "~/renderer/components/Spinner";
import Tooltip from "~/renderer/components/Tooltip";
import TranslatedError from "~/renderer/components/TranslatedError";
import IconCheck from "~/renderer/icons/Check";
import IconSyncServer from "~/renderer/icons/SyncServer";
import IconPending from "~/renderer/icons/Clock";
import IconError from "~/renderer/icons/Error";
import IconLoader from "~/renderer/icons/Loader";
import IconWarning from "~/renderer/icons/TriangleWarning";
import {
  accountNeedsMigrationSelector,
  isUpToDateAccountSelector,
} from "~/renderer/reducers/accounts";
import { colors } from "~/renderer/styles/theme";
import { openModal } from "~/renderer/actions/modals";
import useEnv from "~/renderer/hooks/useEnv";

const mapStateToProps = createStructuredSelector({
  isUpToDateAccount: isUpToDateAccountSelector,
  needsMigration: accountNeedsMigrationSelector,
});

class StatusQueued extends PureComponent<{ onClick: (*) => void }> {
  render() {
    const { onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.outdated" />}>
        <Box onClick={onClick}>
          <IconPending color={colors.grey} size={16} />
        </Box>
      </Tooltip>
    );
  }
}

class StatusSynchronizing extends PureComponent<{ onClick: (*) => void }> {
  render() {
    const { onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.syncing" />}>
        <Box onClick={onClick}>
          <Rotating onClick={onClick} size={16}>
            <IconLoader color={colors.grey} size={16} />
          </Rotating>
        </Box>
      </Tooltip>
    );
  }
}

class StatusUpToDate extends PureComponent<{ showSatStackIcon?: boolean, onClick: (*) => void }> {
  render() {
    const { showSatStackIcon, onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.upToDate" />}>
        <Box onClick={onClick}>
          {showSatStackIcon ? (
            <IconSyncServer onClick={onClick} color={colors.positiveGreen} size={16} />
          ) : (
            <IconCheck onClick={onClick} color={colors.positiveGreen} size={16} />
          )}
        </Box>
      </Tooltip>
    );
  }
}

class StatusError extends PureComponent<{ onClick: (*) => void, error: ?Error }> {
  render() {
    const { onClick, error } = this.props;
    return (
      <Tooltip
        tooltipBg="alertRed"
        content={
          <Box style={{ maxWidth: 250 }}>
            <TranslatedError error={error} />
          </Box>
        }
      >
        <Box onClick={onClick}>
          <IconError onClick={onClick} color={colors.alertRed} size={16} />
        </Box>
      </Tooltip>
    );
  }
}

const StatusNeedsMigration = React.memo<{}>(function StatusNeedsMigration() {
  const dispatch = useDispatch();

  const openMigrateAccountsModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(openModal("MODAL_MIGRATE_ACCOUNTS"));
    },
    [dispatch],
  );

  return (
    <Tooltip content={<Trans i18nKey="common.sync.needsMigration" />}>
      <Box onClick={openMigrateAccountsModal}>
        <IconWarning onClick={openMigrateAccountsModal} color={colors.orange} size={16} />
      </Box>
    </Tooltip>
  );
});

type OwnProps = {
  accountId: string,
  account: AccountLike,
};

type Props = OwnProps & {
  isUpToDateAccount: boolean,
  needsMigration: boolean,
};

const AccountSyncStatusIndicator = ({
  accountId,
  account,
  isUpToDateAccount,
  needsMigration,
}: Props) => {
  const { pending, error } = useAccountSyncState({ accountId });
  const sync = useBridgeSync();
  const [userAction, setUserAction] = useState(false);
  const timeout = useRef(null);
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  const currency = getAccountCurrency(account);

  const showSatStackIcon = satStackAlreadyConfigured && currency.id === "bitcoin";

  const onClick = useCallback(
    e => {
      e.stopPropagation();
      sync({ type: "SYNC_ONE_ACCOUNT", accountId, priority: 10 });
      setUserAction(true);
      // a user action is kept in memory for a short time (which will correspond to a spinner time)
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setUserAction(false), 1000);
    },
    [sync, accountId],
  );

  // at unmount, clear all timeouts
  useEffect(() => {
    clearTimeout(timeout.current);
  }, []);

  if (needsMigration) {
    return <StatusNeedsMigration onClick={onClick} />;
  }
  // We optimistically will show things are up to date even if it's actually synchronizing
  // in order to "debounce" the UI and don't make it blinks each time a sync happens
  // only when user did the account we will show the true state
  if ((pending && !isUpToDateAccount) || userAction) {
    return <StatusSynchronizing onClick={onClick} />;
  }
  if (error) {
    return <StatusError onClick={onClick} error={error} />;
  }
  if (isUpToDateAccount) {
    return <StatusUpToDate showSatStackIcon={showSatStackIcon} onClick={onClick} />;
  }
  return <StatusQueued onClick={onClick} />;
};

const m: React$ComponentType<OwnProps> = connect(mapStateToProps)(AccountSyncStatusIndicator);

export default m;
