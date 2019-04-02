// @flow

import { map } from 'rxjs/operators'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'
import { scanAccountsOnDevice } from '@ledgerhq/live-common/lib/libcore/scanAccountsOnDevice'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { encodeAccount } from 'reducers/accounts'

type Input = {
  devicePath: string,
  currencyId: string,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanAccounts',
  ({ devicePath, currencyId }) =>
    scanAccountsOnDevice(getCryptoCurrencyById(currencyId), devicePath).pipe(
      map(account => encodeAccount(account)),
    ),
)

export default cmd
