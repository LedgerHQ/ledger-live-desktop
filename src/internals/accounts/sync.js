// @flow

import type { IPCSend } from 'types/electron'

export default (send: IPCSend) => {
  setTimeout(() => send('accounts.sync.success'), 5e3)
}
