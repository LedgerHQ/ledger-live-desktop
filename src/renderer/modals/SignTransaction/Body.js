// @flow

import React, { useCallback, useState } from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { Trans, withTranslation } from "react-i18next";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Account, AccountLike, SignedOperation } from "@ledgerhq/live-common/lib/types";
import type { PlatformTransaction } from "@ledgerhq/live-common/lib/platform/types";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import Stepper from "~/renderer/components/Stepper";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Track from "~/renderer/analytics/Track";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import StepConnectDevice from "./steps/StepConnectDevice";
import StepSummary, { StepSummaryFooter } from "./steps/StepSummary";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import type { St, StepId } from "./types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge/index";
import logger from "~/logger/logger";

type OwnProps = {|
  stepId: StepId,
  onChangeStepId: StepId => void,
  onClose: () => void,
  params: {
    canEditFees: boolean,
    useApp?: string,
    account: ?AccountLike,
    transactionData: PlatformTransaction,
    onResult: (signedOperation: SignedOperation) => void,
    onCancel: (reason: any) => void,
    parentAccount: ?Account,
    startWithWarning?: boolean,
    recipient?: string,
    amount?: BigNumber,
  },
  setError: (error?: Error) => void,
|};

type StateProps = {|
  t: TFunction,
  device: ?Device,
  accounts: Account[],
  closeModal: string => void,
  openModal: (string, any) => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const createSteps = (canEditFees = false): St[] => {
  const steps = [
    {
      id: "summary",
      label: <Trans i18nKey="send.steps.summary.title" />,
      component: StepSummary,
      footer: StepSummaryFooter,
      onBack: canEditFees ? ({ transitionTo }) => transitionTo("amount") : null,
    },
    {
      id: "device",
      label: <Trans i18nKey="send.steps.device.title" />,
      component: StepConnectDevice,
      onBack: ({ transitionTo }) => transitionTo("summary"),
    },
    {
      id: "confirmation",
      label: <Trans i18nKey="send.steps.confirmation.title" />,
      excludeFromBreadcrumb: true,
      component: StepConfirmation,
      footer: StepConfirmationFooter,
      onBack: ({ transitionTo, onRetry }) => {
        onRetry();
        transitionTo("summary");
      },
    },
  ];

  return canEditFees
    ? [
        {
          id: "amount",
          label: <Trans i18nKey="send.steps.amount.title" />,
          component: StepAmount,
          footer: StepAmountFooter,
        },
        ...steps,
      ]
    : steps;
};

const STATUS_KEYS_IGNORE = ["recipient", "gasLimit"];

// returns the first error
function getStatusError(status, type = "errors"): ?Error {
  if (!status || !status[type]) return null;

  const firstKey = Object.keys(status[type]).find(k => !STATUS_KEYS_IGNORE.includes(k));

  return firstKey ? status[type][firstKey] : null;
}

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
});

const mapDispatchToProps = {
  closeModal,
  openModal,
  updateAccountWithUpdater,
};

const Body = ({
  t,
  device,
  openModal,
  closeModal,
  onChangeStepId,
  onClose,
  setError,
  stepId,
  params,
  accounts,
}: Props) => {
  const { canEditFees, transactionData } = params;

  const openedFromAccount = !!params.account;
  const [steps] = useState(() => createSteps(canEditFees));

  const {
    transaction,
    setTransaction,
    updateTransaction,
    account,
    parentAccount,
    setAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const parentAccount = params && params.parentAccount;
    const account = getMainAccount((params && params.account) || accounts[0], parentAccount);

    const bridge = getAccountBridge(account, parentAccount);
    const tx = bridge.createTransaction(account);

    const { recipient, ...txData } = transactionData;
    const tx2 = bridge.updateTransaction(tx, {
      recipient,
    });
    const transaction = bridge.updateTransaction(tx2, {
      ...txData,
    });

    return { account, parentAccount, transaction };
  });

  const [transactionError, setTransactionError] = useState(null);

  const handleCloseModal = useCallback(() => {
    closeModal("MODAL_SIGN_TRANSACTION");
  }, [closeModal]);

  const handleChangeAccount = useCallback(
    (nextAccount: AccountLike, nextParentAccount: ?Account) => {
      if (account !== nextAccount) {
        setAccount(nextAccount, nextParentAccount);
      }
    },
    [account, setAccount],
  );

  const handleRetry = useCallback(() => {
    setTransactionError(null);
    setError(undefined);
  }, [setError]);

  const handleTransactionError = useCallback(
    (error: Error) => {
      if (!(error instanceof UserRefusedOnDevice)) {
        logger.critical(error);
      }
      setTransactionError(error);
      setError(error);
    },
    [setError],
  );

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleTransactionSigned = useCallback(
    (signedTransaction: SignedOperation) => {
      params.onResult(signedTransaction);
      handleCloseModal();
    },
    [handleCloseModal, params],
  );

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(steps.length - 2);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const error = transactionError || bridgeError || getStatusError(status, "errors");
  const warning = getStatusError(status, "warnings");

  const stepperProps = {
    title: t("sign.title"),
    stepId,
    useApp: params.useApp,
    steps,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    hideBreadcrumb: (!!error && ["amount"].includes(stepId)) || stepId === "warning",
    error,
    warning,
    status,
    bridgePending,
    openModal,
    onClose,
    closeModal: handleCloseModal,
    onChangeAccount: handleChangeAccount,
    onChangeTransaction: setTransaction,
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onTransactionSigned: handleTransactionSigned,
    onTransactionError: handleTransactionError,
    updateTransaction,
  };

  if (!status) return null;

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalSignTransaction" />
    </Stepper>
  );
};

const m: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default m;
