// @flow

import React, { useState } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

type Props = {
  stepId: StepId,
  onClose: Function,
};

const SendModal = ({ stepId, onClose }: Props) => {
  const [state, setState] = useState({
    stepId: stepId || "recipient",
  });

  const handleReset = () => {
    setState({
      ...state,
      stepId: "recipient",
    });
  };

  const handleStepChange = (stepId: StepId) => setState({ ...state, stepId });

  const isModalLocked = ["recipient", "confirmation"].includes(state.stepId);

  const rest = {};
  if (onClose) {
    rest.onClose = onClose;
  }

  return (
    <Modal
      name="MODAL_SEND"
      centered
      refocusWhenChange={state.stepId}
      onHide={handleReset}
      preventBackdropClick={isModalLocked}
      render={({ onClose, data }) => (
        <Body
          stepId={state.stepId}
          onClose={onClose}
          onChangeStepId={handleStepChange}
          params={data || {}}
        />
      )}
      {...rest}
    />
  );
};

export default SendModal;
