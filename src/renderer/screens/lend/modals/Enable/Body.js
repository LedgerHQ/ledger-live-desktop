// @flow
import React, { useState, useCallback } from "react";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";

import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";

import type { Account, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import type { StepId, StepProps, St } from "./types";
import TrackPage from "~/renderer/analytics/TrackPage";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";

import Track from "~/renderer/analytics/Track";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { closeModal, openModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import logger from "~/logger/logger";

type OwnProps = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  params: {
    account: AccountLike,
    parentAccount: Account,
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
    label: <Trans i18nKey="lend.enable.steps.amount.title" />,
    component: StepAmount,
    footer: StepAmountFooter,
  },
  {
    id: "connectDevice",
    label: (
      <>
        <TrackPage category="Lend" name="Approve Step 2" />
        <Trans i18nKey="lend.enable.steps.connectDevice.title" />
      </>
    ),
    component: GenericStepConnectDevice,
    onBack: ({ transitionTo }: StepProps) => transitionTo("amount"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="lend.enable.steps.confirmation.title" />,
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
  name,
  // $FlowFixMe
  params,
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
    const bridge = getAccountBridge(account, parentAccount);
    const ctoken = findCompoundToken(account.token);

    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      recipient: ctoken?.contractAddress || "",
      mode: "erc20.approve",
      useAllAmount: true,
      gasPrice: null,
      userGasLimit: null,
      subAccountId: account.id,
    });

    return { account, parentAccount, transaction };
  });

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleRetry = useCallback(() => {
    onChangeStepId("amount");
    setTransactionError(null);
  }, [onChangeStepId]);

  const handleTransactionError = useCallback((error: Error) => {
    if (!(error instanceof UserRefusedOnDevice)) {
      logger.critical(error);
    }
    setTransactionError(error);
  }, []);

  const handleOperationBroadcasted = useCallback(
    (optimisticOperation: Operation) => {
      if (!account || !parentAccount) return;
      dispatch(
        updateAccountWithUpdater(parentAccount.id, account =>
          addPendingOperation(account, optimisticOperation),
        ),
      );
      setOptimisticOperation(optimisticOperation);
      setTransactionError(null);
    },
    [account, parentAccount, dispatch],
  );

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(2);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const stepperProps = {
    title: t("lend.enable.title"),
    device,
    account,
    parentAccount,
    transaction,
    signed,
    stepId,
    steps,
    errorSteps,
    disabledSteps: [],
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
    status,
    optimisticOperation,
    openModal,
    setSigned,
    onChangeTransaction: setTransaction,
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
    t,
    bridgePending,
    hideBreadcrumb: !!transactionError,
    bridgeError,
    transactionError,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalLendingEnable" />
    </Stepper>
  );
};

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
