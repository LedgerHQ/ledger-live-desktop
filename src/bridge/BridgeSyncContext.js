// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'
import { updateAccountWithUpdater } from 'actions/accounts'
import { setAccountSyncState, setAccountPullMoreState } from 'actions/bridgeSync'
import {
  bridgeSyncSelector,
  syncStateLocalSelector,
  pullMoreStateLocalSelector,
} from 'reducers/bridgeSync'
import type { BridgeSyncState } from 'reducers/bridgeSync'
import { accountsSelector } from 'reducers/accounts'
import { getBridgeForCurrency } from '.'

// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

// $FlowFixMe can't wait flow implement createContext
const BridgeSyncContext = React.createContext(() => {})

type BridgeSyncProviderProps = {
  children: *,
}

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  bridgeSync: BridgeSyncState,
  accounts: Account[],
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  setAccountSyncState: (string, AsyncState) => *,
  setAccountPullMoreState: (string, AsyncState) => *,
}

type AsyncState = {
  pending: boolean,
  error: ?Error,
}

type BridgeSync = {
  synchronize: (accountId: string) => Promise<void>,

  // sync for all accounts (if there were errors it stopped)
  syncAll: () => {},

  //
  pullMoreOperations: (accountId: string, count: number) => Promise<void>,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  bridgeSync: bridgeSyncSelector,
})

const actions = {
  updateAccountWithUpdater,
  setAccountSyncState,
  setAccountPullMoreState,
}

class Provider extends Component<BridgeSyncProviderOwnProps, BridgeSync> {
  constructor() {
    super()
    const syncPromises = {}
    const syncSubs = {}
    const pullMorePromises = {}

    const getSyncState = accountId => syncStateLocalSelector(this.props.bridgeSync, { accountId })

    const getPullMoreOperationsState = accountId =>
      pullMoreStateLocalSelector(this.props.bridgeSync, { accountId })

    const getAccountById = accountId => {
      const a = this.props.accounts.find(a => a.id === accountId)
      if (!a) throw new Error('account not found')
      return a
    }

    const getBridgeForAccountId = accountId =>
      getBridgeForCurrency(getAccountById(accountId).currency)

    const pullMoreOperations = (accountId, count) => {
      const state = getPullMoreOperationsState(accountId)
      if (state.pending) {
        return (
          pullMorePromises[accountId] || Promise.reject(new Error('no pullMore started. (bug)'))
        )
      }
      this.props.setAccountPullMoreState(accountId, { pending: true, error: null })
      const bridge = getBridgeForAccountId(accountId)
      const p = bridge.pullMoreOperations(getAccountById(accountId), count).then(
        accountUpdater => {
          this.props.setAccountPullMoreState(accountId, {
            pending: false,
            error: null,
          })
          this.props.updateAccountWithUpdater(accountId, accountUpdater)
        },
        error => {
          this.props.setAccountPullMoreState(accountId, {
            pending: false,
            error,
          })
        },
      )
      pullMorePromises[accountId] = p
      return p
    }

    const synchronize = accountId => {
      const state = getSyncState(accountId)
      if (state.pending) {
        return syncPromises[accountId] || Promise.reject(new Error('no sync started. (bug)'))
      }

      this.props.setAccountSyncState(accountId, { pending: true, error: null })
      const bridge = getBridgeForAccountId(accountId)
      const p = new Promise((resolve, reject) => {
        const subscription = bridge.synchronize(getAccountById(accountId), {
          next: accountUpdater => {
            this.props.updateAccountWithUpdater(accountId, accountUpdater)
          },
          complete: () => {
            this.props.setAccountSyncState(accountId, { pending: false, error: null })
            resolve()
          },
          error: error => {
            this.props.setAccountSyncState(accountId, { pending: false, error })
            reject(error)
          },
        })
        syncSubs[accountId] = subscription
      })
      syncPromises[accountId] = p
      return p
    }

    const syncAll = () => Promise.all(this.props.accounts.map(account => synchronize(account.id)))

    this.api = {
      synchronize,
      syncAll,
      pullMoreOperations,
    }
  }

  componentDidMount() {
    const syncLoop = async () => {
      try {
        await this.api.syncAll()
      } catch (e) {
        console.error('sync issues', e)
      }
      setTimeout(syncLoop, 10 * 1000)
    }
    setTimeout(syncLoop, 2 * 1000)
  }

  api: BridgeSync

  render() {
    return (
      <BridgeSyncContext.Provider value={this.api}>
        {this.props.children}
      </BridgeSyncContext.Provider>
    )
  }
}

export const BridgeSyncProvider = connect(mapStateToProps, actions)(Provider)

export const BridgeSyncConsumer = BridgeSyncContext.Consumer
