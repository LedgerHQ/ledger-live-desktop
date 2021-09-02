// @flow

import type { TFunction } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  SignedOperation,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { Step } from "~/renderer/components/Stepper";

export type StepId = "amount" | "summary" | "device" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  openedFromAccount: boolean,
  useApp?: string,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  bridgePending: boolean,
  error: ?Error,
  warning: ?Error,
  closeModal: void => void,
  openModal: (string, any) => void,
  onChangeAccount: (?AccountLike, ?Account) => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onTransactionSigned: SignedOperation => void,
  onRetry: void => void,
  maybeRecipient?: string,
  onResetMaybeRecipient: () => void,
  maybeAmount?: BigNumber,
  onResetMaybeAmount: () => void,
  updateTransaction: (updater: any) => void,
};

export type St = Step<StepId, StepProps>;
