// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import type { StepId } from "./types";
type State = {
  stepId: StepId,
};

const INITIAL_STATE = {
  stepId: "amount",
};

type Props = { name: string, account: AccountLike, parentAccount: Account };

class WithdrawFlowModal extends PureComponent<Props, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  handleReset = () =>
    this.setState({
      stepId: "amount",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;
    const { name } = this.props;

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
            onClose={onClose}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
          />
        )}
      />
    );
  }
}

export default WithdrawFlowModal;
