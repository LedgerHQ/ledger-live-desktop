// @flow

import type { TFunction } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { Step } from "~/renderer/components/Stepper";

export type StepId = "warning" | "recipient" | "amount" | "summary" | "device" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  openedFromAccount: boolean,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  bridgePending: boolean,
  error: ?Error,
  optimisticOperation: ?Operation,
  closeModal: void => void,
  openModal: (string, any) => void,
  onChangeAccount: (?AccountLike, ?Account) => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  onRetry: void => void,
  setSigned: boolean => void,
  signed: boolean,
  maybeRecipient?: string,
  onResetMaybeRecipient: () => void,
  maybeAmount?: BigNumber,
  onResetMaybeAmount: () => void,
  updateTransaction: (updater: any) => void,
  onConfirmationHandler: Function,
  onFailHandler: Function,
  currencyName: ?string,

  isNFTSend?: boolean,
  maybeNFTId?: string,
  maybeNFTCollection?: string,
  onChangeQuantities: any => void,
  onChangeNFT: any => void,
};

export type St = Step<StepId, StepProps>;
