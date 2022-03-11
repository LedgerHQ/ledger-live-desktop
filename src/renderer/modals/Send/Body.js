// @flow

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { Trans, withTranslation } from "react-i18next";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import { addPendingOperation, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Account, AccountLike, Operation, Transaction } from "@ledgerhq/live-common/lib/types";
import logger from "~/logger";
import Stepper from "~/renderer/components/Stepper";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Track from "~/renderer/analytics/Track";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import StepRecipient, { StepRecipientFooter } from "./steps/StepRecipient";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import StepConnectDevice from "./steps/StepConnectDevice";
import StepSummary, { StepSummaryFooter } from "./steps/StepSummary";
import StepConfirmation, { StepConfirmationFooter } from "./steps/StepConfirmation";
import StepWarning, { StepWarningFooter } from "./steps/StepWarning";
import type { St, StepId } from "./types";

type OwnProps = {|
  stepId: StepId,
  onChangeStepId: StepId => void,
  onClose: () => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    startWithWarning?: boolean,
    recipient?: string,
    amount?: BigNumber,
    disableBacks?: string[],
    isNFTSend?: boolean,
    walletConnectProxy?: boolean,
    nftId?: string,
    nftCollection?: string,
    transaction?: Transaction,
    onConfirmationHandler: Function,
    onFailHandler: Function,
  },
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

const createSteps = (disableBacks = []): St[] => [
  {
    id: "warning",
    excludeFromBreadcrumb: true,
    component: StepWarning,
    footer: StepWarningFooter,
  },
  {
    id: "recipient",
    label: <Trans i18nKey="send.steps.recipient.title" />,
    component: StepRecipient,
    footer: StepRecipientFooter,
  },
  {
    id: "amount",
    label: <Trans i18nKey="send.steps.amount.title" />,
    component: StepAmount,
    footer: StepAmountFooter,
    onBack: !disableBacks.includes("amount")
      ? ({ transitionTo }) => transitionTo("recipient")
      : null,
  },
  {
    id: "summary",
    label: <Trans i18nKey="send.steps.summary.title" />,
    component: StepSummary,
    footer: StepSummaryFooter,
    onBack: !disableBacks.includes("transaction")
      ? ({ transitionTo }) => transitionTo("amount")
      : null,
  },
  {
    id: "device",
    label: <Trans i18nKey="send.steps.device.title" />,
    component: StepConnectDevice,
    onBack: !disableBacks.includes("device") ? ({ transitionTo }) => transitionTo("summary") : null,
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="send.steps.confirmation.title" />,
    excludeFromBreadcrumb: true,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
    onBack: null,
  },
];

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
  stepId,
  params,
  accounts,
  updateAccountWithUpdater,
}: Props) => {
  const openedFromAccount = !!params.account;
  const isNFTSend = !!params.isNFTSend;
  const walletConnectProxy = !!params.walletConnectProxy;
  const [steps] = useState(() => createSteps(params.disableBacks));

  // initial values might coming from deeplink
  const [maybeAmount, setMaybeAmount] = useState(() => params.amount || null);
  const [maybeRecipient, setMaybeRecipient] = useState(() => params.recipient || null);
  const maybeNFTId = useMemo(() => params.nftId, [params.nftId]);
  const maybeNFTCollection = useMemo(() => params.nftCollection, [params.nftCollection]);

  const onResetMaybeAmount = useCallback(() => {
    setMaybeAmount(null);
  }, [setMaybeAmount]);

  const onResetMaybeRecipient = useCallback(() => {
    setMaybeRecipient(null);
  }, [setMaybeRecipient]);

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
    const account = (params && params.account) || accounts[0];
    return { account, parentAccount, transaction: params.transaction };
  });

  // make sure step id is in sync
  useEffect(() => {
    const stepId = params && params.startWithWarning ? "warning" : null;
    if (stepId) onChangeStepId(stepId);
  }, [onChangeStepId, params]);

  const [optimisticOperation, setOptimisticOperation] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [signed, setSigned] = useState(false);

  const currency = account ? getAccountCurrency(account) : undefined;

  const currencyName = currency ? currency.name : undefined;

  const handleCloseModal = useCallback(() => {
    closeModal("MODAL_SEND");
  }, [closeModal]);

  const handleChangeAccount = useCallback(
    (nextAccount: AccountLike, nextParentAccount: ?Account) => {
      if (account !== nextAccount) {
        setAccount(nextAccount, nextParentAccount);
      }
    },
    [account, setAccount],
  );

  const handleChangeNFT = useCallback(
    nextNft => {
      setAccount(account);
      const bridge = getAccountBridge(account);
      const standard = nextNft.collection.standard.toLowerCase();

      setTransaction(
        bridge.updateTransaction(transaction, {
          tokenIds: [nextNft.tokenId],
          quantities: [BigNumber(1)],
          collection: nextNft.collection.contract,
          mode: `${standard}.transfer`,
        }),
      );
    },
    [account, setAccount, setTransaction, transaction],
  );

  const handleChangeQuantities = useCallback(
    nextQuantity => {
      const bridge = getAccountBridge(account);
      const cleanQuantity = BigNumber(nextQuantity.replace(/\D/g, "") || 0);

      if (!transaction.quantities[0].eq(cleanQuantity)) {
        setTransaction(
          bridge.updateTransaction(transaction, {
            quantities: [BigNumber(cleanQuantity)],
          }),
        );
      }
    },
    [account, setTransaction, transaction],
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
      updateAccountWithUpdater(mainAccount.id, account =>
        addPendingOperation(account, optimisticOperation),
      );
      setOptimisticOperation(optimisticOperation);
      setTransactionError(null);
    },
    [account, parentAccount, updateAccountWithUpdater],
  );

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const errorSteps = [];

  if (transactionError) {
    errorSteps.push(3);
  } else if (bridgeError) {
    errorSteps.push(0);
  }

  const error = transactionError || bridgeError;

  const stepperProps = {
    title:
      stepId === "warning"
        ? t("common.information")
        : isNFTSend
        ? t("send.titleNft")
        : t("send.title"),
    stepId,
    steps,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    signed,
    currencyName,
    hideBreadcrumb: (!!error && ["recipient", "amount"].includes(stepId)) || stepId === "warning",
    error,
    status,
    bridgePending,
    optimisticOperation,
    openModal,
    onClose,
    setSigned,
    closeModal: handleCloseModal,
    onChangeAccount: handleChangeAccount,
    onChangeTransaction: setTransaction,
    onRetry: handleRetry,
    onStepChange: handleStepChange,
    onOperationBroadcasted: handleOperationBroadcasted,
    onTransactionError: handleTransactionError,
    maybeAmount,
    onResetMaybeAmount,
    maybeRecipient,
    onResetMaybeRecipient,
    updateTransaction,
    walletConnectProxy,
    onConfirmationHandler: params.onConfirmationHandler,
    onFailHandler: params.onFailHandler,
    isNFTSend,
    maybeNFTId,
    maybeNFTCollection,
    onChangeQuantities: handleChangeQuantities,
    onChangeNFT: handleChangeNFT,
  };

  if (!status) return null;

  return (
    <Stepper {...stepperProps}>
      {stepId === "confirmation" ? null : <SyncSkipUnderPriority priority={100} />}
      <Track onUnmount event="CloseModalSend" />
    </Stepper>
  );
};

const m: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default m;
