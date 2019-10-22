/* eslint-disable react/no-unused-prop-types */
// @flow
// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

import logger from 'logger'
import shuffle from 'lodash/shuffle'
import React, { Component, useContext } from 'react'
import priorityQueue from 'async/priorityQueue'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import { createStructuredSelector } from 'reselect'
import { updateAccountWithUpdater } from 'actions/accounts'
import { setAccountSyncState } from 'actions/bridgeSync'
import { bridgeSyncSelector, syncStateLocalSelector } from 'reducers/bridgeSync'
import type { BridgeSyncState } from 'reducers/bridgeSync'
import { accountsSelector, isUpToDateSelector } from 'reducers/accounts'
import { currenciesStatusSelector, currencyDownStatusLocal } from 'reducers/currenciesStatus'
import { SYNC_MAX_CONCURRENT } from 'config/constants'
import type { CurrencyStatus } from 'reducers/currenciesStatus'
import { track } from '../analytics/segment'

type BridgeSyncProviderProps = {
  children: *,
}

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  bridgeSync: BridgeSyncState,
  accounts: Account[],
  isUpToDate: boolean,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  setAccountSyncState: (string, AsyncState) => *,
  currenciesStatus: CurrencyStatus[],
}

type AsyncState = {
  pending: boolean,
  error: ?Error,
}

export type BehaviorAction =
  | { type: 'BACKGROUND_TICK' }
  | { type: 'SET_SKIP_UNDER_PRIORITY', priority: number }
  | { type: 'SYNC_ONE_ACCOUNT', accountId: string, priority: number }
  | { type: 'SYNC_SOME_ACCOUNTS', accountIds: string[], priority: number }
  | { type: 'SYNC_ALL_ACCOUNTS', priority: number }

export type Sync = (action: BehaviorAction) => void

// $FlowFixMe
const BridgeSyncContext = React.createContext((_: BehaviorAction) => {})

export const useBridgeSync = () => useContext(BridgeSyncContext)

const mapStateToProps = createStructuredSelector({
  currenciesStatus: currenciesStatusSelector,
  accounts: accountsSelector,
  bridgeSync: bridgeSyncSelector,
  isUpToDate: isUpToDateSelector,
})

const actions = {
  updateAccountWithUpdater,
  setAccountSyncState,
}

const lastTimeAnalyticsTrackPerAccountId = {}

class Provider extends Component<BridgeSyncProviderOwnProps, Sync> {
  constructor() {
    super()
    const synchronize = (accountId: string, next: () => void) => {
      const state = syncStateLocalSelector(this.props.bridgeSync, { accountId })
      if (state.pending) {
        next()
        return
      }
      const account = this.props.accounts.find(a => a.id === accountId)
      if (!account) {
        next()
        return
      }

      const downStatus = currencyDownStatusLocal(this.props.currenciesStatus, account.currency)
      if (downStatus && !downStatus.keepSync) {
        next()
        return
      }

      try {
        const bridge = getAccountBridge(account)
        this.props.setAccountSyncState(accountId, { pending: true, error: null })

        const startSyncTime = Date.now()
        const trackedRecently =
          lastTimeAnalyticsTrackPerAccountId[accountId] &&
          startSyncTime - lastTimeAnalyticsTrackPerAccountId[accountId] < 90 * 1000
        if (!trackedRecently) {
          lastTimeAnalyticsTrackPerAccountId[accountId] = startSyncTime
        }
        const trackEnd = event => {
          if (trackedRecently) return
          const account = this.props.accounts.find(a => a.id === accountId)
          if (!account) return
          const subAccounts = account.subAccounts || []
          track(event, {
            duration: (Date.now() - startSyncTime) / 1000,
            currencyName: account.currency.name,
            derivationMode: account.derivationMode,
            freshAddressPath: account.freshAddressPath,
            operationsLength: account.operations.length,
            tokensLength: subAccounts.length,
          })
          if (event === 'SyncSuccess') {
            subAccounts.forEach(a => {
              track('SyncSuccessToken', {
                tokenId: getAccountCurrency(a).id,
                tokenTicker: getAccountCurrency(a).ticker,
                operationsLength: a.operations.length,
                parentCurrencyName: account.currency.name,
                parentDerivationMode: account.derivationMode,
              })
            })
          }
        }

        bridge.startSync(account, false).subscribe({
          next: accountUpdater => {
            this.props.updateAccountWithUpdater(accountId, accountUpdater)
          },
          complete: () => {
            trackEnd('SyncSuccess')
            this.props.setAccountSyncState(accountId, { pending: false, error: null })
            next()
          },
          error: error => {
            if (!error || error.name !== 'NetworkDown') {
              trackEnd('SyncError')
            }
            logger.critical(error)
            this.props.setAccountSyncState(accountId, { pending: false, error })
            next()
          },
        })
      } catch (error) {
        this.props.setAccountSyncState(accountId, { pending: false, error })
        next()
      }
    }

    const syncQueue = priorityQueue(synchronize, SYNC_MAX_CONCURRENT)

    let skipUnderPriority: number = -1

    const schedule = (ids: string[], priority: number) => {
      if (priority < skipUnderPriority) return
      // by convention we remove concurrent tasks with same priority
      // FIXME this is somehow a hack. ideally we should just dedup the account ids in the pending queue...
      syncQueue.remove(o => priority === o.priority)
      logger.debug('schedule', { type: 'syncQueue', ids })
      syncQueue.push(ids, -priority)
    }

    // don't always sync in same order to avoid potential "never account never reached"
    const shuffledAccountIds = () => shuffle(this.props.accounts.map(a => a.id))

    const handlers = {
      BACKGROUND_TICK: () => {
        if (syncQueue.idle()) {
          schedule(shuffledAccountIds(), -1)
        }
      },

      SET_SKIP_UNDER_PRIORITY: ({ priority }: { priority: number }) => {
        if (priority === skipUnderPriority) return
        skipUnderPriority = priority
        syncQueue.remove(({ priority }) => priority < skipUnderPriority)
        if (priority === -1 && !this.props.isUpToDate) {
          // going back to -1 priority => retriggering a background sync if it is "Paused"
          schedule(shuffledAccountIds(), -1)
        }
      },

      SYNC_ALL_ACCOUNTS: ({ priority }: { priority: number }) => {
        schedule(shuffledAccountIds(), priority)
      },

      SYNC_ONE_ACCOUNT: ({ accountId, priority }: { accountId: string, priority: number }) => {
        schedule([accountId], priority)
      },

      SYNC_SOME_ACCOUNTS: ({
        accountIds,
        priority,
      }: {
        accountIds: string[],
        priority: number,
      }) => {
        schedule(accountIds, priority)
      },
    }

    const sync = (action: BehaviorAction) => {
      const handler = handlers[action.type]
      if (handler) {
        logger.debug(`action ${action.type}`, { action, type: 'syncQueue' })
        // $FlowFixMe
        handler(action)
      } else {
        logger.warn('BridgeSyncContext unsupported action', { action, type: 'syncQueue' })
      }
    }

    this.api = sync
  }

  api: Sync

  render() {
    return (
      <BridgeSyncContext.Provider value={this.api}>
        {this.props.children}
      </BridgeSyncContext.Provider>
    )
  }
}

export const BridgeSyncProvider = connect(
  mapStateToProps,
  actions,
)(Provider)

export const BridgeSyncConsumer = BridgeSyncContext.Consumer
