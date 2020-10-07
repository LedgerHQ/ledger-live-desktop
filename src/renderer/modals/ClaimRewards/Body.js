// @flow
import React, { useState, useCallback } from "react";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import Track from "~/renderer/analytics/Track";

import { UserRefusedOnDevice } from "@ledgerhq/errors";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import type { StepId, StepProps, St } from "./types";
import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";

import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { closeModal, openModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepRewards, { StepRewardsFooter } from "./steps/StepRewards";
import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import logger from "~/logger/logger";

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
    id: "rewards",
    label: <Trans i18nKey="claimReward.steps.rewards.title" />,
    component: StepRewards,
    footer: StepRewardsFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="claimReward.steps.connectDevice.title" />,
    component: GenericStepConnectDevice,
    onBack: ({ transitionTo }: StepProps) => transitionTo("rewards"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="claimReward.steps.confirmation.title" />,
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

  const { transaction, account, parentAccount, status, bridgeError } = useBridgeTransaction(() => {
    const { account, parentAccount } = params;

    const bridge = getAccountBridge(account, parentAccount);

    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      mode: "claimReward",
    });

    return { account, parentAccount, transaction };
  });

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleRetry = useCallback(() => {
    onChangeStepId("rewards");
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

  const error = transactionError || bridgeError;

  const stepperProps = {
    title: t("claimReward.title"),
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
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalUnFreeze" />
    </Stepper>
  );
};

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
