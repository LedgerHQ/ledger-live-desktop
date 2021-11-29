import React, { PureComponent, useCallback, useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useBridgeSync, useAccountSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { AccountLike } from "@ledgerhq/live-common/lib/types";
import { Flex, Tooltip, Icons, InfiniteLoader } from "@ledgerhq/react-ui";

import TranslatedError from "~/renderer/components/TranslatedError";
import IconSyncServer from "~/renderer/icons/SyncServer";
import {
  accountNeedsMigrationSelector,
  isUpToDateAccountSelector,
} from "~/renderer/reducers/accounts";
import { openModal } from "~/renderer/actions/modals";
import useEnv from "~/renderer/hooks/useEnv";

const mapStateToProps = createStructuredSelector({
  isUpToDateAccount: isUpToDateAccountSelector,
  needsMigration: accountNeedsMigrationSelector,
});

const ICON_SIZE = 18;

class StatusQueued extends PureComponent<{ onClick: (any) => void }> {
  render() {
    const { onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.outdated" />}>
        <Flex onClick={onClick}>
          <Icons.ClockMedium color="palette.neutral.c80" size={ICON_SIZE} />
        </Flex>
      </Tooltip>
    );
  }
}

class StatusSynchronizing extends PureComponent<{ onClick: (any) => void }> {
  render() {
    const { onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.syncing" />}>
        <Flex onClick={onClick}>
          <InfiniteLoader style={{ height: ICON_SIZE, width: ICON_SIZE }} />
        </Flex>
      </Tooltip>
    );
  }
}

class StatusUpToDate extends PureComponent<{ showSatStackIcon?: boolean; onClick: (any) => void }> {
  render() {
    const { showSatStackIcon, onClick } = this.props;
    return (
      <Tooltip content={<Trans i18nKey="common.sync.upToDate" />}>
        <Flex onClick={onClick}>
          {showSatStackIcon ? (
            <IconSyncServer onClick={onClick} color="palette.success.c100" />
          ) : (
            <Icons.CircledCheckMedium
              onClick={onClick}
              color="palette.success.c100"
              size={ICON_SIZE}
            />
          )}
        </Flex>
      </Tooltip>
    );
  }
}

class StatusError extends PureComponent<{ onClick: (any) => void; error?: Error }> {
  render() {
    const { onClick, error } = this.props;
    return (
      <Tooltip
        content={
          <Flex style={{ maxWidth: 250 }}>
            <TranslatedError error={error} />
          </Flex>
        }
      >
        <Flex onClick={onClick}>
          <Icons.CircledCrossMedium onClick={onClick} color="palette.error.c100" />
        </Flex>
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
      <Flex onClick={openMigrateAccountsModal}>
        <Icons.WarningMedium
          onClick={openMigrateAccountsModal}
          color="palette.warning.c100"
          size={ICON_SIZE}
        />
      </Flex>
    </Tooltip>
  );
});

type OwnProps = {
  accountId: string;
  account: AccountLike;
};

type Props = OwnProps & {
  isUpToDateAccount: boolean;
  needsMigration: boolean;
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

const m: React.ReactComponentType<OwnProps> = connect(mapStateToProps)(AccountSyncStatusIndicator);

export default m;
