// @flow

import React, { PureComponent } from "react";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import type { StepId } from "./types";

import Modal from "~/renderer/components/Modal";
import perFamily from "~/renderer/generated/DelegationModal";

type State = {
  stepId: StepId,
};

class DelegationModal extends PureComponent<
  { name: string, account: AccountLike, parentAccount: ?Account },
  State,
> {
  state = {
    stepId: "starter",
  };

  handleReset = () => this.setState({ stepId: "starter" });

  handleStepChange = (stepId: StepId) => {
    this.setState({ stepId });
  };

  render() {
    const { account, parentAccount, name } = this.props;
    const mainAccount = getMainAccount(account, parentAccount);
    const PerFamily = perFamily[mainAccount.currency.family];

    const { stepId } = this.state;
    const isModalLocked = !["account", "confirmation"].includes(stepId);

    return (
      PerFamily && (
        <Modal
          name={name}
          centered
          refocusWhenChange={stepId}
          onHide={this.handleReset}
          preventBackdropClick={isModalLocked}
          render={({ onClose, data }) => (
            <PerFamily
              stepId={stepId}
              onClose={onClose}
              onChangeStepId={this.handleStepChange}
              params={data || {}}
              name={name}
            />
          )}
        />
      )
    );
  }
}

export default DelegationModal;
