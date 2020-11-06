// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId, Mode } from "./types";
type State = {
  stepId: StepId,
};

const INITIAL_STATE = {
  stepId: "info",
};

class SimpleOperationModal extends PureComponent<{ name: string, mode: Mode }, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;
    const { name, mode } = this.props;

    const isModalLocked = ["connectDevice", "confirmation"].includes(stepId);

    return (
      <Modal
        name={name}
        centered
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        render={({ onClose, data }) => (
          <Body
            stepId={stepId}
            name={name}
            mode={mode}
            onClose={onClose}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
          />
        )}
      />
    );
  }
}

export default SimpleOperationModal;
