// @flow
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { Step } from "~/renderer/components/Stepper";
import type { Account, TransactionStatus, Operation } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";

export type StepId = "amount" | "device" | "confirmation";

export type StepProps = {
  transitionTo: (address: string) => void,
  device: ?Device,
  account: ?Account,
  parentAccount: typeof undefined,
  onRetry: () => void,
  onClose: () => void,
  openModal: (key: string, config?: any) => void,
  optimisticOperation: any,
  error: any,
  signed: boolean,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeTransaction: (tx: Transaction) => void,
  onUpdateTransaction: ((tx: Transaction) => Transaction) => void,
  onTransactionError: (error: Error) => void,
  onOperationBroadcasted: (operation: Operation) => void,
  setSigned: (signed: boolean) => void,
  bridgePending: boolean,
  validatorAddress: string,
};

export type St = Step<StepId, StepProps>;
