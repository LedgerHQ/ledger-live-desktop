// @flow
import React, { useState, useCallback } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Track from "~/renderer/analytics/Track";

import type { StepId, StepProps, St } from "./types";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import type { Device } from "~/renderer/reducers/devices";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { closeModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepRewards, { StepRewardsFooter } from "./steps/StepRewards";
import StepConnectDevice, { StepConnectDeviceFooter } from "./steps/StepConnectDevice";
import StepConfirmation from "./steps/StepConfirmation";

type OwnProps = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    startWithWarning?: boolean,
    receiveTokenMode?: boolean,
  },
  name: string,
|};

type StateProps = {|
  t: TFunction,
  device: ?Device,
  accounts: Account[],
  device: ?Device,
  closeModal: string => void,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const createSteps = (): Array<St> => [
  {
    id: "rewards",
    label: <Trans i18nKey="unfreeze.steps.amount.title" />,
    component: StepRewards,
    noScroll: true,
    footer: StepRewardsFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="unfreeze.steps.connectDevice.title" />,
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo("rewards"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="unfreeze.steps.confirmation.title" />,
    component: StepConfirmation,
  },
];

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const mapDispatchToProps = {
  closeModal,
};

const Body = ({ t, stepId, device, closeModal, onChangeStepId, params, name }: Props) => {
  const [steps] = useState(createSteps);
  const { account, parentAccount } = params;
  const [disabledSteps, setDisabledSteps] = useState([]);
  const [token, setToken] = useState(null);

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleResetSkip = useCallback(() => {
    setDisabledSteps([]);
  }, [setDisabledSteps]);

  const handleRetry = useCallback(() => {
    /** @TODO */
  }, []);

  const handleSkipConfirm = useCallback(() => {
    /** @TODO */
  }, []);

  const stepperProps = {
    title: t("unfreeze.title"),
    device,
    account,
    parentAccount,
    stepId,
    steps,
    errorSteps: [],
    disabledSteps,
    hideBreadcrumb: false,
    token,
    closeModal: handleCloseModal,
    onRetry: handleRetry,
    onSkipConfirm: handleSkipConfirm,
    onResetSkip: handleResetSkip,
    onChangeToken: setToken,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
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
