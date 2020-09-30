// @flow
import type { TFunction } from "react-i18next";
import type { Device } from "~/renderer/reducers/devices";
import type { Step } from "~/renderer/components/Stepper";

import type {
  Account,
  AccountLike,
  TransactionStatus,
  Operation,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";

export type StepId = "amount" | "connectDevice" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  device: ?Device,
  account: ?Account,
  accounts: ?(AccountLike[]),
  currency: CryptoCurrency | TokenCurrency,
  parentAccount: ?Account,
  onRetry: void => void,
  onClose: () => void,
  openModal: (key: string, config?: any) => void,
  onChangeAccount: (nextAccount: AccountLike, nextParentAccount?: Account) => void,
  optimisticOperation: *,
  error: *,
  signed: boolean,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  setSigned: boolean => void,
  bridgePending: boolean,
};

export type St = Step<StepId, StepProps>;
