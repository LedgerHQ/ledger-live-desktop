// @flow
import React, { useState, useCallback, useMemo } from "react";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { BigNumber } from "bignumber.js";

import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { StepId, StepProps, St } from "./types";

import { updateAccountWithUpdater } from "~/renderer/actions/accounts";

import Track from "~/renderer/analytics/Track";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { closeModal, openModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import logger from "~/logger/logger";

export const getUnfreezeData = (
  account: Account,
): {
  unfreezeBandwidth: BigNumber,
  unfreezeEnergy: BigNumber,
  canUnfreezeBandwidth: boolean,
  canUnfreezeEnergy: boolean,
  bandwidthExpiredAt: Date,
  energyExpiredAt: Date,
} => {
  const { tronResources } = account;
  const {
    frozen: { bandwidth, energy },
  } = tronResources || {};

  /** ! expiredAt should always be set with the amount if not this will disable the field by default ! */
  const { amount: bandwidthAmount, expiredAt: bandwidthExpiredAt } = bandwidth || {};
  const _bandwidthExpiredAt = +new Date(bandwidthExpiredAt);

  const { amount: energyAmount, expiredAt: energyExpiredAt } = energy || {};
  const _energyExpiredAt = +new Date(energyExpiredAt);

  const unfreezeBandwidth = BigNumber(bandwidthAmount || 0);
  const canUnfreezeBandwidth = unfreezeBandwidth.gt(0) && Date.now() > _bandwidthExpiredAt;

  const unfreezeEnergy = BigNumber(energyAmount || 0);
  const canUnfreezeEnergy = unfreezeEnergy.gt(0) && Date.now() > _energyExpiredAt;

  return {
    unfreezeBandwidth,
    unfreezeEnergy,
    canUnfreezeBandwidth,
    canUnfreezeEnergy,
    bandwidthExpiredAt,
    energyExpiredAt,
  };
};

type OwnProps = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  params: {
    account: Account,
    parentAccount: ?Account,
    reward: number,
  },
  name: string,
|};

type StateProps = {|
  t: TFunction,
  device: ?Device,
  accounts: Account[],
  device: ?Device,
  closeModal: string => void,
  openModal: string => void,
|};

type Props = OwnProps & StateProps;

const steps: Array<St> = [
  {
    id: "amount",
    label: <Trans i18nKey="unfreeze.steps.amount.title" />,
    component: StepAmount,
    noScroll: true,
    footer: StepAmountFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="unfreeze.steps.connectDevice.title" />,
    component: GenericStepConnectDevice,
    onBack: ({ transitionTo }: StepProps) => transitionTo("amount"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="unfreeze.steps.confirmation.title" />,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
  },
];

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const mapDispatchToProps = {
  closeModal,
  openModal,
};

const Body = ({
  t,
  stepId,
  device,
  closeModal,
  openModal,
  onChangeStepId,
  params,
  name,
}: Props) => {
  const [optimisticOperation, setOptimisticOperation] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [signed, setSigned] = useState(false);
  const dispatch = useDispatch();

  const {
    transaction,
    setTransaction,
    account,
    parentAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const { account, parentAccount } = params;

    const { canUnfreezeBandwidth } = getUnfreezeData(account);

    const bridge = getAccountBridge(account, parentAccount);

    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      mode: "unfreeze",
      resource: canUnfreezeBandwidth ? "BANDWIDTH" : "ENERGY",
    });

    return { account, parentAccount, transaction };
  });

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleRetry = useCallback(() => {
    onChangeStepId("amount");
  }, [onChangeStepId]);

  const handleTransactionError = useCallback((error: Error) => {
    if (!(error instanceof UserRefusedOnDevice)) {
      logger.critical(error);
    }
    setTransactionError(error);
  }, []);

  const handleOperationBroadcasted = useCallback(
    (optimisticOperation: Operation) => {
      if (!account) return;
      dispatch(
        updateAccountWithUpdater(account.id, account =>
          addPendingOperation(account, optimisticOperation),
        ),
      );
      setOptimisticOperation(optimisticOperation);
      setTransactionError(null);
    },
    [account, dispatch],
  );

  const statusError = useMemo(() => status.errors && Object.values(status.errors)[0], [
    status.errors,
  ]);

  const error =
    // WARNING: this is bad practice. out of scope but see context of a fix done for LL-3854
    transactionError || bridgeError || (statusError instanceof Error ? statusError : null);

  const stepperProps = {
    title: t("unfreeze.title"),
    device,
    account,
    parentAccount,
    transaction,
    signed,
    stepId,
    steps,
    errorSteps: [],
    disabledSteps: [],
    hideBreadcrumb: !!error,
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
    reward: params.reward,
    error,
    status,
    optimisticOperation,
    openModal,
    setSigned,
    onChangeTransaction: setTransaction,
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
    t,
    bridgePending,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalUnfreeze" />
    </Stepper>
  );
};

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
