// @flow
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import logger from "~/logger/logger";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { closeModal, openModal } from "~/renderer/actions/modals";
import Track from "~/renderer/analytics/Track";
import Stepper from "~/renderer/components/Stepper";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { useSteps } from "./steps";
import type { StepId } from "./types";

type Props = {
  account: Account,
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  name: string,
  validatorAddress: string,
};

export default function Body({
  account: accountProp,
  stepId,
  onChangeStepId,
  name,
  validatorAddress,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const device = useSelector(getCurrentDevice);

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
  } = useBridgeTransaction(() => {
    invariant(accountProp.cosmosResources, "cosmos: account and cosmos resources required");
    const delegations = accountProp.cosmosResources.delegations || [];
    const bridge = getAccountBridge(accountProp, undefined);

    const initTx = bridge.createTransaction(accountProp);
    const transaction = bridge.updateTransaction(initTx, {
      mode: "undelegation",
      validators: delegations.map(({ validatorAddress, amount }) => ({
        address: validatorAddress,
        amount,
      })),
      /** @TODO remove this once the bridge handles it */
      recipient: accountProp.freshAddress,
    });

    return { account: accountProp, transaction };
  });

  const steps = useSteps();
  const error = transactionError || bridgeError;

  const handleRetry = useCallback(() => {
    onChangeStepId("amount");
  }, [onChangeStepId]);

  const handleStepChange = useCallback(({ id }) => onChangeStepId(id), [onChangeStepId]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal(name));
  }, [dispatch, name]);

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

  const stepperProps = {
    title: t("cosmos.undelegation.flow.title"),
    device,
    account,
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
    validatorAddress,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalUndelegation" />
    </Stepper>
  );
}
