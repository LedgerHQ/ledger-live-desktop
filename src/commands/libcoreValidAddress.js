// @flow

import { from } from 'rxjs'
import { createCommand, Command } from 'helpers/ipc'
import { isValidRecipient } from '@ledgerhq/live-common/lib/libcore/isValidRecipient'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { serializeError } from '@ledgerhq/errors/lib/helpers'

type Input = {
  address: string,
  currencyId: string,
}

const cmd: Command<Input, *> = createCommand('libcoreValidAddress', ({ currencyId, address }) =>
  from(
    isValidRecipient({ currency: getCryptoCurrencyById(currencyId), recipient: address }).then(
      o => o && serializeError(o),
    ),
  ),
)

export default cmd
