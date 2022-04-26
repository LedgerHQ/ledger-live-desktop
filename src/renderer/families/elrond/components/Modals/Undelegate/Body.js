// @flow
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import type { Operation } from "@ledgerhq/live-common/lib/types";

import logger from "~/logger/logger";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { closeModal, openModal } from "~/renderer/actions/modals";
import Track from "~/renderer/analytics/Track";
import Stepper from "~/renderer/components/Stepper";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { useSteps } from "./steps";

type OwnProps = {|
  account: Account,
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  contract: string,
  validators: Array<any>,
  name: string,
  amount: string,
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

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const mapDispatchToProps = {
  closeModal,
  openModal,
};

function Body({
  t,
  account: accountProp,
  stepId,
  onChangeStepId,
  closeModal,
  openModal,
  device,
  name,
  contract,
  validators,
  amount,
  delegations,
}: Props) {
  const dispatch = useDispatch();

  const [optimisticOperation, setOptimisticOperation] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [signed, setSigned] = useState(false);

  const {
    account,
    transaction,
    bridgeError,
    setTransaction,
    updateTransaction,
    bridgePending,
    status,
  } = useBridgeTransaction(() => {
    const bridge = getAccountBridge(accountProp, undefined);
    const transaction = bridge.createTransaction(accountProp);

    return {
      account: accountProp,
      transaction: contract
        ? bridge.updateTransaction(transaction, {
            recipient: contract,
          })
        : transaction,
    };
  });

  const steps = useSteps();
  const error = transactionError || bridgeError;

  const handleRetry = useCallback(() => {
    setTransactionError(null);
    onChangeStepId("amount");
  }, [onChangeStepId]);

  const handleStepChange = useCallback(({ id }) => onChangeStepId(id), [onChangeStepId]);

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [name, closeModal]);

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

  const handleTransactionError = useCallback((error: Error) => {
    if (!(error instanceof UserRefusedOnDevice)) {
      logger.critical(error);
    }
    setTransactionError(error);
  }, []);

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(2);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const stepperProps = {
    title: t("elrond.undelegation.flow.title"),
    device,
    account,
    transaction,
    signed,
    stepId,
    steps,
    errorSteps,
    disabledSteps: [],
    hideBreadcrumb: !!error && ["amount"].includes(stepId),
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
    bridgePending,
    contract,
    validators,
    amount,
    delegations,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount={true} event="CloseModalUndelegation" />
    </Stepper>
  );
}

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
