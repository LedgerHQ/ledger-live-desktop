// @flow
// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

import logger from 'logger'
import shuffle from 'lodash/shuffle'
import React, { Component } from 'react'
import priorityQueue from 'async/priorityQueue'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'
import { updateAccountWithUpdater } from 'actions/accounts'
import { setAccountSyncState } from 'actions/bridgeSync'
import { bridgeSyncSelector, syncStateLocalSelector } from 'reducers/bridgeSync'
import type { BridgeSyncState } from 'reducers/bridgeSync'
import { accountsSelector } from 'reducers/accounts'
import { SYNC_BOOT_DELAY, SYNC_ALL_INTERVAL } from 'config/constants'
import { getBridgeForCurrency } from '.'

type BridgeSyncProviderProps = {
  children: *,
}

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  bridgeSync: BridgeSyncState,
  accounts: Account[],
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  setAccountSyncState: (string, AsyncState) => *,
}

type AsyncState = {
  pending: boolean,
  error: ?Error,
}

export type BehaviorAction =
  | { type: 'BACKGROUND_TICK' }
  | { type: 'SET_SKIP_UNDER_PRIORITY', priority: number }
  | { type: 'SYNC_ONE_ACCOUNT', accountId: string, priority: number }
  | { type: 'SYNC_ALL_ACCOUNTS', priority: number }

export type Sync = (action: BehaviorAction) => void

const BridgeSyncContext = React.createContext((_: BehaviorAction) => {})

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  bridgeSync: bridgeSyncSelector,
})

const actions = {
  updateAccountWithUpdater,
  setAccountSyncState,
}

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
      if (!account) throw new Error('account not found')

      const bridge = getBridgeForCurrency(account.currency)

      this.props.setAccountSyncState(accountId, { pending: true, error: null })

      // TODO use Subscription to unsubscribe at relevant time
      bridge.synchronize(account).subscribe({
        next: accountUpdater => {
          this.props.updateAccountWithUpdater(accountId, accountUpdater)
        },
        complete: () => {
          this.props.setAccountSyncState(accountId, { pending: false, error: null })
          next()
        },
        error: error => {
          this.props.setAccountSyncState(accountId, { pending: false, error })
          next()
        },
      })
    }

    const syncQueue = priorityQueue(synchronize, 2)

    let skipUnderPriority: number = -1

    const schedule = (ids: string[], priority: number) => {
      if (priority < skipUnderPriority) return
      // by convention we remove concurrent tasks with same priority
      syncQueue.remove(o => priority === o.priority)
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

      SET_SKIP_UNDER_PRIORITY: ({ priority }) => {
        if (priority === skipUnderPriority) return
        skipUnderPriority = priority
        syncQueue.remove(({ priority }) => priority < skipUnderPriority)
      },

      SYNC_ALL_ACCOUNTS: ({ priority }) => {
        schedule(shuffledAccountIds(), priority)
      },

      SYNC_ONE_ACCOUNT: ({ accountId, priority }) => {
        schedule([accountId], priority)
      },
    }

    const sync = (action: BehaviorAction) => {
      const handler = handlers[action.type]
      if (handler) {
        // $FlowFixMe
        handler(action)
      } else {
        logger.warn('BridgeSyncContext unsupported action', action)
      }
    }

    this.api = sync
  }

  componentDidMount() {
    const syncLoop = async () => {
      this.api({ type: 'BACKGROUND_TICK' })
      this.syncTimeout = setTimeout(syncLoop, SYNC_ALL_INTERVAL)
    }
    this.syncTimeout = setTimeout(syncLoop, SYNC_BOOT_DELAY)
  }

  componentWillUnmount() {
    clearTimeout(this.syncTimeout)
  }

  syncTimeout: *
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
