// @flow
import React, { useState, useCallback, useMemo } from "react";
import { compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type {
  Account,
  Operation,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { getAccountById } from "~/renderer/reducers/accounts";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import Track from "~/renderer/analytics/Track";
import { closeModal, openModal } from "~/renderer/actions/modals";
import Stepper from "~/renderer/components/Stepper";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import logger from "~/logger/logger";
import type { StepId, StepProps, St } from "./types";

type OwnProps = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  params: {
    account: Account,
    parentAccount: ?Account,
    currency: CryptoCurrency | TokenCurrency,
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
  getAccount: (id: string) => ?Account,
|};

type Props = OwnProps & StateProps;

const steps: Array<St> = [
  {
    id: "amount",
    label: <Trans i18nKey="lend.supply.steps.amount.title" />,
    component: StepAmount,
    footer: StepAmountFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="lend.supply.steps.device.title" />,
    component: GenericStepConnectDevice,
    onBack: ({ transitionTo }: StepProps) => transitionTo("amount"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="lend.supply.steps.confirmation.title" />,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
  },
];

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  getAccount: getAccountById,
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
  getAccount,
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
    setAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const { account, parentAccount } = params;
    const bridge = getAccountBridge(account, parentAccount);
    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      mode: "compound.supply",
      subAccountId: account.id,
      amount: account.spendableBalance,
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

  const handleChangeAccount = useCallback(
    (nextAccount: AccountLike) => {
      if (account !== nextAccount && nextAccount.type === "TokenAccount") {
        const nextParentAccount = getAccount(nextAccount.parentId);
        setAccount(nextAccount, nextParentAccount);
      }
    },
    [account, setAccount, getAccount],
  );

  const statusError = useMemo(() => status.errors && Object.values(status.errors)[0], [
    status.errors,
  ]);

  const error =
    transactionError || bridgeError || (statusError instanceof Error ? statusError : null);

  const errorSteps = [];

  console.log({ bridgeError, statusError });

  if (transactionError) {
    errorSteps.push(2);
  } else if (error) {
    errorSteps.push(0);
  }

  const stepperProps = {
    title: t("lend.supply.title"),
    device,
    currency: params.currency,
    account,
    parentAccount,
    transaction,
    signed,
    stepId,
    steps,
    errorSteps,
    disabledSteps: [],
    hideBreadcrumb: false,
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
    onChangeAccount: handleChangeAccount,
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
