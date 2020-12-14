// @flow

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import invariant from "invariant";
import type { Account, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import { useBakers, useRandomBaker } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import whitelist from "@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getMainAccount, addPendingOperation } from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import logger from "~/logger";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import Track from "~/renderer/analytics/Track";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { delegatableAccountsSelector } from "~/renderer/actions/general";
import { closeModal, openModal } from "~/renderer/actions/modals";
import Stepper from "~/renderer/components/Stepper";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import StepAccount, { StepAccountFooter } from "./steps/StepAccount";
import StepStarter from "./steps/StepStarter";
import StepConnectDevice from "./steps/StepConnectDevice";
import StepSummary, { StepSummaryFooter } from "./steps/StepSummary";
import StepValidator from "./steps/StepValidator";
import StepCustom, { StepCustomFooter } from "./steps/StepCustom";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import type { StepId, St } from "./types";

const createTitles = t => ({
  account: t("delegation.flow.steps.account.title"),
  starter: t("delegation.flow.steps.starter.title"),
  summary: t("delegation.flow.steps.summary.title"),
  validator: t("delegation.flow.steps.validator.title"),
  undelegate: t("delegation.flow.steps.undelegate.title"),
  confirmation: t("delegation.flow.steps.confirmation.title"),
  custom: t("delegation.flow.steps.custom.title"),
});

type Props = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    mode: ?string,
    eventType?: string,
    stepId: ?StepId,
  },
|};

const createSteps = (params): St[] => [
  {
    id: "starter",
    component: StepStarter,
    excludeFromBreadcrumb: true,
  },
  {
    id: "account",
    label: <Trans i18nKey="delegation.flow.steps.account.label" />,
    component: StepAccount,
    footer: StepAccountFooter,
    excludeFromBreadcrumb: Boolean(params && params.account),
  },
  {
    id: "summary",
    label: <Trans i18nKey="delegation.flow.steps.summary.label" />,
    component: StepSummary,
    footer: StepSummaryFooter,
    onBack: params && params.account ? null : ({ transitionTo }) => transitionTo("account"),
  },
  {
    id: "validator",
    excludeFromBreadcrumb: true,
    component: StepValidator,
    onBack: ({ transitionTo }) => transitionTo("summary"),
  },
  {
    id: "custom",
    excludeFromBreadcrumb: true,
    component: StepCustom,
    footer: StepCustomFooter,
    // NB do not put a back here. we need to manage back ourself to reset the transaction back in initial state
  },
  {
    id: "device",
    excludeFromBreadcrumb: true,
    component: StepConnectDevice,
    onBack: ({ transitionTo }) => transitionTo("summary"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="delegation.flow.steps.confirmation.label" />,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
  },
];

const Body = ({ onChangeStepId, onClose, stepId, params }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const device = useSelector(getCurrentDevice);
  const accounts = useSelector(delegatableAccountsSelector);
  const openedFromAccount = !!params.account;
  const bakers = useBakers(whitelist);
  const randomBaker = useRandomBaker(bakers);

  const [steps] = useState(() => createSteps(params));
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
    const parentAccount = params && params.parentAccount;
    const account = (params && params.account) || accounts[0];
    return { account, parentAccount };
  });

  // make sure tx is in sync
  useEffect(() => {
    if (!transaction || !account) return;
    invariant(transaction.family === "tezos", "tezos tx");

    // make sure the mode is in sync (an account changes can reset it)
    const patch: Object = {
      mode: (params && params.mode) || "delegate",
    };

    // make sure that in delegate mode, a transaction recipient is set (random pick)
    if (patch.mode === "delegate" && !transaction.recipient && stepId !== "custom" && randomBaker) {
      patch.recipient = randomBaker.address;
    }

    // when changes, we set again
    if (patch.mode !== transaction.mode || "recipient" in patch) {
      setTransaction(
        getAccountBridge(account, parentAccount).updateTransaction(transaction, patch),
      );
    }
  }, [account, randomBaker, stepId, params, parentAccount, setTransaction, transaction]);

  // make sure step id is in sync
  useEffect(() => {
    const stepId = params && params.stepId;
    if (stepId) onChangeStepId(stepId);
  }, [onChangeStepId, params]);

  const [optimisticOperation, setOptimisticOperation] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [signed, setSigned] = useState(false);

  const handleCloseModal = useCallback(() => dispatch(closeModal("MODAL_DELEGATE")), [dispatch]);
  const handleOpenModal = useMemo(() => bindActionCreators(openModal, dispatch), [dispatch]);

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
    setOptimisticOperation(null);
    setSigned(false);
  }, []);

  const handleTransactionError = useCallback((error: Error) => {
    if (!(error instanceof UserRefusedOnDevice)) {
      logger.critical(error);
    }
    setTransactionError(error);
  }, []);

  const handleOperationBroadcasted = useCallback(
    (optimisticOperation: Operation) => {
      if (!account) return;
      const mainAccount = getMainAccount(account, parentAccount);
      dispatch(
        updateAccountWithUpdater(mainAccount.id, account =>
          addPendingOperation(account, optimisticOperation),
        ),
      );
      setOptimisticOperation(optimisticOperation);
      setTransactionError(null);
    },
    [account, parentAccount, dispatch],
  );

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const titles = useMemo(() => createTitles(t), [t]);

  const title =
    transaction && transaction.family === "tezos" && transaction.mode === "undelegate"
      ? titles.undelegate
      : titles[String(stepId)] || titles.account;

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(2);
  } else if (bridgeError) {
    errorSteps.push(1);
  }

  const isRandomChoice =
    !transaction || !randomBaker || transaction.recipient === randomBaker.address;

  const error = transactionError || bridgeError;

  const stepperProps = {
    title,
    stepId,
    openedWithAccount: Boolean(params && params.account),
    steps,
    eventType: params.eventType,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    hideBreadcrumb:
      stepId === "starter" ||
      stepId === "validator" ||
      stepId === "custom" ||
      stepId === "confirmation",
    error,
    status,
    bridgePending,
    signed,
    setSigned,
    optimisticOperation,
    openModal: handleOpenModal,
    onClose,
    isRandomChoice,
    closeModal: handleCloseModal,
    onChangeAccount: handleChangeAccount,
    onChangeTransaction: setTransaction,
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
  };

  if (!status) return null;

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalDelegate" />
    </Stepper>
  );
};

export default Body;
