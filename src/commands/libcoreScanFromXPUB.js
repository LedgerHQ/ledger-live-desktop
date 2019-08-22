// @flow

import { BigNumber } from 'bignumber.js'
import { reduce, map } from 'rxjs/operators'
import type { AccountRaw, Account, DerivationMode } from '@ledgerhq/live-common/lib/types'
import { syncAccount } from '@ledgerhq/live-common/lib/libcore/syncAccount'
import { createCommand, Command } from 'helpers/ipc'
import { encodeAccountId, toAccountRaw } from '@ledgerhq/live-common/lib/account'
import { runDerivationScheme } from '@ledgerhq/live-common/lib/derivation'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'

type Input = {
  currencyId: string,
  xpub: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanFromXPUB',
  ({ currencyId, xpub, derivationMode, seedIdentifier }) => {
    const currency = getCryptoCurrencyById(currencyId)
    const freshAddress = ''
    const freshAddressPath = runDerivationScheme(derivationMode, getCryptoCurrencyById(currencyId))
    const account: $Exact<Account> = {
      type: 'Account',
      name: `(DEV) ${currencyId}`,
      xpub,
      seedIdentifier,
      id: encodeAccountId({
        type: 'libcore_dev',
        version: '1',
        currencyId,
        xpubOrAddress: xpub,
        derivationMode,
      }),
      derivationMode,
      currency,
      unit: currency.units[0],
      index: 0,
      freshAddress,
      freshAddressPath,
      freshAddresses: [{ address: freshAddress, derivationPath: freshAddressPath }],
      lastSyncDate: new Date(),
      blockHeight: 0,
      balance: BigNumber(0),
      operations: [],
      pendingOperations: [],
    }
    return syncAccount(account)
      .pipe(reduce((acc, updater: Account => Account) => updater(acc), account))
      .pipe(map(a => toAccountRaw(a)))
  },
)

export default cmd
