// @flow

import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
} from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'
import type { StepProps as DefaultStepProps } from 'components/base/Stepper'

export type StepProps = DefaultStepProps & {
  openedFromAccount: boolean,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  bridgeError: ?Error,
  bridgePending: boolean,
  error: ?Error,
  signed: boolean,
  optimisticOperation: ?Operation,
  closeModal: void => void,
  openModal: (string, any) => void,
  isAppOpened: boolean,
  onChangeAccount: (?AccountLike, ?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  onRetry: void => void,
  signTransaction: ({ transitionTo: string => void }) => void,
}
