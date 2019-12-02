// @flow
import type { Operation } from '@ledgerhq/live-common/lib/types'

export default {
  getURLWhatIsThis: (op: Operation) =>
    op.type !== 'IN' && op.type !== 'OUT'
      ? 'https://support.ledger.com/hc/en-us/articles/360010653260'
      : null,
}
