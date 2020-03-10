// @flow
import React, { useState, useCallback } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Track from "~/renderer/analytics/Track";

import type { StepId, St } from "~/renderer/modals/Delegation/types";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import type { Device } from "~/renderer/reducers/devices";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { closeModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepStarter, { StepStarterFooter } from "./steps/StepStarter";

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

const createSteps = (): St[] => [
  {
    id: "starter",
    component: StepStarter,
    excludeFromBreadcrumb: true,
    footer: StepStarterFooter,
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
