// @flow
import type { Account } from '@ledgerhq/live-common/lib/types'

// TODO move this back in live-common

// An account is empty if there is no operations AND balance is zero.
// balance can be non-zero in edgecases, for instance:
// - Ethereum contract only funds (api limitations)
// - Ripple node that don't show all ledgers and if you have very old txs
export default (a: Account): boolean => a.operations.length === 0 && a.balance.isZero()
