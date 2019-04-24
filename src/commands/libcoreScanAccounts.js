// @flow

import { map } from 'rxjs/operators'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'
import { scanAccountsOnDevice } from '@ledgerhq/live-common/lib/libcore/scanAccountsOnDevice'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { toAccountRaw } from '@ledgerhq/live-common/lib/account'

type Input = {
  devicePath: string,
  currencyId: string,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanAccounts',
  ({ devicePath, currencyId }) =>
    scanAccountsOnDevice(getCryptoCurrencyById(currencyId), devicePath).pipe(
      map(account => toAccountRaw(account)),
    ),
)

export default cmd
