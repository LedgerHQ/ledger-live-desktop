// @flow
import type { TFunction } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { Step } from "~/renderer/components/Stepper";
import type { BigNumber } from "bignumber.js";

import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
} from "@ledgerhq/live-common/lib/types";

export type StepId = "rewards" | "connectDevice" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  reward: ?BigNumber,
  onRetry: void => void,
  onClose: () => void,
  openModal: (key: string, config?: any) => void,
  optimisticOperation: *,
  error: *,
  signed: boolean,
  transaction: ?Transaction,
  status: TransactionStatus,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  setSigned: boolean => void,
};

export type St = Step<StepId, StepProps>;
