// @flow
import type { TFunction } from "react-i18next";
import type { Device } from "~/renderer/reducers/devices";
import type { Step } from "~/renderer/components/Stepper";

import type {
  Account,
  TransactionStatus,
  Operation,
  Transaction,
} from "@ledgerhq/live-common/lib/types";

export type StepId = "amount" | "connectDevice" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  device: ?Device,
  account: ?Account,
  parentAccount: ?Account,
  onRetry: void => void,
  onClose: () => void,
  openModal: (key: string, config?: any) => void,
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
