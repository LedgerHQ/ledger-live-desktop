// @flow
import type { TFunction } from "react-i18next";
import type { Account, TokenCurrency, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Device } from "~/renderer/reducers/devices";
import type { Step } from "~/renderer/components/Stepper";
import type { BigNumber } from "bignumber.js";

export type StepId = "rewards" | "connectDevice" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  reward: ?BigNumber,
  token: ?TokenCurrency,
  receiveTokenMode: boolean,
  closeModal: void => void,
  onRetry: void => void,
  onSkipConfirm: void => void,
  onResetSkip: void => void,
  onClose: () => void,
  optimisticOperation: *,
  error: *,
  openModal: (name: string, *) => void,
  signed: boolean,
};

export type St = Step<StepId, StepProps>;
