/* eslint-disable react/no-unused-prop-types */
// @flow
// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

import uniq from "lodash/uniq";
import shuffle from "lodash/shuffle";
import React, { Component, useContext } from "react";
import priorityQueue from "async/priorityQueue";
import { connect } from "react-redux";
import { concat, from } from "rxjs";
import { ignoreElements } from "rxjs/operators";
import { createStructuredSelector } from "reselect";
import type { OutputSelector } from "reselect";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import logger from "~/logger";

import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { setAccountSyncState } from "~/renderer/actions/bridgeSync";

import { bridgeSyncSelector, syncStateLocalSelector } from "~/renderer/reducers/bridgeSync";
import type { BridgeSyncState } from "~/renderer/reducers/bridgeSync";
import { accountsSelector, isUpToDateSelector } from "~/renderer/reducers/accounts";
import {
  currenciesStatusSelector,
  currencyDownStatusLocal,
} from "~/renderer/reducers/currenciesStatus";
import type { CurrencyStatus } from "~/renderer/reducers/currenciesStatus";
import type { State } from "~/renderer/reducers";

import { recentlyChangedExperimental } from "~/renderer/experimental";
import { recentlyKilledInternalProcess, onUnusualInternalProcessError } from "~/renderer/reset";
import { track } from "~/renderer/analytics/segment";

import { prepareCurrency, hydrateCurrency } from "./cache";

type BridgeSyncProviderProps = {
  children: *,
};

type AsyncState = {
  pending: boolean,
  error: ?Error,
};

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  bridgeSync: BridgeSyncState,
  accounts: Account[],
  isUpToDate: boolean,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  setAccountSyncState: (string, AsyncState) => *,
  currenciesStatus: CurrencyStatus[],
};

export type BehaviorAction =
  | { type: "BACKGROUND_TICK" }
  | { type: "SET_SKIP_UNDER_PRIORITY", priority: number }
  | { type: "SYNC_ONE_ACCOUNT", accountId: string, priority: number }
  | { type: "SYNC_SOME_ACCOUNTS", accountIds: string[], priority: number }
  | { type: "SYNC_ALL_ACCOUNTS", priority: number };

export type Sync = (action: BehaviorAction) => void;

// $FlowFixMe
const BridgeSyncContext = React.createContext((_: BehaviorAction) => {});

export const useBridgeSync = () => useContext(BridgeSyncContext);

const mapStateToProps: OutputSelector<State, void, *> = createStructuredSelector({
  currenciesStatus: currenciesStatusSelector,
  accounts: accountsSelector,
  bridgeSync: bridgeSyncSelector,
  isUpToDate: isUpToDateSelector,
});

const actions = {
  updateAccountWithUpdater,
  setAccountSyncState,
};

const lastTimeAnalyticsTrackPerAccountId = {};

// TODO generalize the concept in live-common
const getVotesCount = (account, parentAccount) => {
  const mainAccount = getMainAccount(account, parentAccount);
  if (mainAccount.currency.id === "tezos") {
    return isAccountDelegating(account) ? 1 : 0;
  }
  return 0;
};

class Provider extends Component<BridgeSyncProviderOwnProps, Sync> {
  constructor() {
    super();

    const synchronize = (accountId: string, next: () => void) => {
      const state = syncStateLocalSelector(this.props.bridgeSync, { accountId });
      if (state.pending) {
        next();
        return;
      }
      const account = this.props.accounts.find(a => a.id === accountId);
      if (!account) {
        next();
        return;
      }

      const downStatus = currencyDownStatusLocal(this.props.currenciesStatus, account.currency);
      if (downStatus && !downStatus.keepSync) {
        next();
        return;
      }

      try {
        const bridge = getAccountBridge(account);
        this.props.setAccountSyncState(accountId, { pending: true, error: null });

        const startSyncTime = Date.now();
        const trackedRecently =
          lastTimeAnalyticsTrackPerAccountId[accountId] &&
          startSyncTime - lastTimeAnalyticsTrackPerAccountId[accountId] < 90 * 1000;
        if (!trackedRecently) {
          lastTimeAnalyticsTrackPerAccountId[accountId] = startSyncTime;
        }
        const trackEnd = event => {
          if (trackedRecently) return;
          const account = this.props.accounts.find(a => a.id === accountId);
          if (!account) return;
          const subAccounts = account.subAccounts || [];
          track(event, {
            duration: (Date.now() - startSyncTime) / 1000,
            currencyName: account.currency.name,
            derivationMode: account.derivationMode,
            freshAddressPath: account.freshAddressPath,
            operationsLength: account.operations.length,
            tokensLength: subAccounts.length,
            votesCount: getVotesCount(account),
          });
          if (event === "SyncSuccess") {
            subAccounts.forEach(a => {
              const tokenId =
                a.type === "TokenAccount" ? getAccountCurrency(a).id : account.currency.name;
              track("SyncSuccessToken", {
                tokenId,
                tokenTicker: getAccountCurrency(a).ticker,
                operationsLength: a.operations.length,
                parentCurrencyName: account.currency.name,
                parentDerivationMode: account.derivationMode,
                votesCount: getVotesCount(a, account),
              });
            });
          }
        };

        const syncConfig = {
          // TODO paginationConfig will come from redux
          paginationConfig: {},
        };

        concat(
          from(prepareCurrency(account.currency)).pipe(ignoreElements()),
          bridge.sync(account, syncConfig),
        ).subscribe({
          next: accountUpdater => {
            this.props.updateAccountWithUpdater(accountId, accountUpdater);
          },
          complete: () => {
            trackEnd("SyncSuccess");
            this.props.setAccountSyncState(accountId, { pending: false, error: null });
            next();
          },
          error: error => {
            const isInternalProcessError =
              error && error.message.includes("Internal process error");

            if (
              isInternalProcessError &&
              (recentlyKilledInternalProcess() || recentlyChangedExperimental())
            ) {
              // This error is normal because the thread was recently killed. we silent it for the user.
              this.props.setAccountSyncState(accountId, { pending: false, error: null });
              next();
              return;
            }

            if (isInternalProcessError) {
              onUnusualInternalProcessError();
            }

            if (error && error.name !== "NetworkDown") {
              trackEnd("SyncError");
            }

            logger.critical(error);
            this.props.setAccountSyncState(accountId, { pending: false, error });
            next();
          },
        });
      } catch (error) {
        this.props.setAccountSyncState(accountId, { pending: false, error });
        next();
      }
    };

    const syncQueue = priorityQueue(synchronize, getEnv("SYNC_MAX_CONCURRENT"));

    let skipUnderPriority: number = -1;

    const schedule = (ids: string[], priority: number) => {
      if (priority < skipUnderPriority) return;
      // by convention we remove concurrent tasks with same priority
      // FIXME this is somehow a hack. ideally we should just dedup the account ids in the pending queue...
      syncQueue.remove(o => priority === o.priority);
      logger.debug("schedule", { type: "syncQueue", ids });
      syncQueue.push(ids, -priority);
    };

    // don't always sync in same order to avoid potential "never account never reached"
    const shuffledAccountIds = () => shuffle(this.props.accounts.map(a => a.id));

    const handlers = {
      BACKGROUND_TICK: () => {
        if (syncQueue.idle()) {
          schedule(shuffledAccountIds(), -1);
        }
      },

      SET_SKIP_UNDER_PRIORITY: ({ priority }: { priority: number }) => {
        if (priority === skipUnderPriority) return;
        skipUnderPriority = priority;
        syncQueue.remove(({ priority }) => priority < skipUnderPriority);
        if (priority === -1 && !this.props.isUpToDate) {
          // going back to -1 priority => retriggering a background sync if it is "Paused"
          schedule(shuffledAccountIds(), -1);
        }
      },

      SYNC_ALL_ACCOUNTS: ({ priority }: { priority: number }) => {
        schedule(shuffledAccountIds(), priority);
      },

      SYNC_ONE_ACCOUNT: ({ accountId, priority }: { accountId: string, priority: number }) => {
        schedule([accountId], priority);
      },

      SYNC_SOME_ACCOUNTS: ({
        accountIds,
        priority,
      }: {
        accountIds: string[],
        priority: number,
      }) => {
        schedule(accountIds, priority);
      },
    };

    const sync = (action: BehaviorAction) => {
      const handler = handlers[action.type];
      if (handler) {
        logger.debug(`action ${action.type}`, { action, type: "syncQueue" });
        // $FlowFixMe
        handler(action);
      } else {
        logger.warn("BridgeSyncContext unsupported action", { action, type: "syncQueue" });
      }
    };

    this.api = sync;
  }

  componentDidMount() {
    uniq(this.props.accounts.map(a => a.currency)).forEach(hydrateCurrency);
  }

  api: Sync;

  render() {
    return (
      <BridgeSyncContext.Provider value={this.api}>
        {this.props.children}
      </BridgeSyncContext.Provider>
    );
  }
}

// $FlowFixMe not sure what to fix here
export const BridgeSyncProvider = connect(mapStateToProps, actions)(Provider);

export const BridgeSyncConsumer = BridgeSyncContext.Consumer;
