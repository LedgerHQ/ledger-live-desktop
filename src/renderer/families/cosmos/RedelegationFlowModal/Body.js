// @flow
import invariant from "invariant";
import React, { useState, useCallback } from "react";
import { BigNumber } from "bignumber.js";
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
import StepStarter, { StepStarterFooter } from "./steps/StepStarter";
import StepValidators, { StepValidatorsFooter } from "./steps/StepValidators";
import StepDestinationValidators from "./steps/StepDestinationValidators";
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
    validatorAddress: ?string,
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
    id: "validators",
    label: <Trans i18nKey="cosmos.redelegation.flow.steps.validators.title" />,
    component: StepValidators,
    noScroll: true,
    footer: StepValidatorsFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="cosmos.redelegation.flow.steps.device.title" />,
    component: GenericStepConnectDevice,
    onBack: ({ transitionTo }: StepProps) => transitionTo("castRedelegations"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="cosmos.redelegation.flow.steps.confirmation.title" />,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
  },
  {
    id: "destinationValidators",
    label: <Trans i18nKey="cosmos.redelegation.flow.steps.validators.title" />,
    component: StepDestinationValidators,
    noScroll: true,
    excludeFromBreadcrumb: true,
    onBack: ({ transitionTo }: StepProps) => transitionTo("validators"),
  },
  {
    id: "starter",
    label: <Trans i18nKey="cosmos.redelegation.flow.steps.starter.title" />,
    component: StepStarter,
    noScroll: true,
    excludeFromBreadcrumb: true,
    footer: StepStarterFooter,
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
    updateTransaction,
    account,
    parentAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const { account, validatorAddress } = params;

    invariant(account && account.cosmosResources, "cosmos: account and cosmos resources required");

    const source = account.cosmosResources?.delegations.find(
      d => d.validatorAddress === validatorAddress,
    );

    const bridge = getAccountBridge(account, undefined);

    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      mode: "redelegate",
      validators: [{ address: "", amount: source?.amount ?? BigNumber(0) }],
      cosmosSourceValidator: validatorAddress,
    });

    return { account, parentAccount: undefined, transaction };
  });

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleRetry = useCallback(() => {
    setTransactionError(null);
    onChangeStepId("validators");
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

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(2);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const stepperProps = {
    title: t("cosmos.redelegation.flow.title"),
    device,
    account,
    parentAccount,
    transaction,
    signed,
    stepId,
    steps,
    errorSteps,
    disabledSteps: [],
    hideBreadcrumb:
      (!!error && ["validators"].includes(stepId)) ||
      ["starter", "destinationValidators"].includes(stepId),
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
    error,
    status,
    optimisticOperation,
    openModal,
    setSigned,
    onChangeTransaction: setTransaction,
    onUpdateTransaction: updateTransaction,
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
    t,
    bridgePending,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalRedelegation" />
    </Stepper>
  );
};

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
