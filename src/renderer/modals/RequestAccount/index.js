// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

class RequestAccountModal extends PureComponent {
  render() {
    return (
      <Modal
        name="MODAL_REQUEST_ACCOUNT"
        centered
        onHide={this.handleReset}
        preventBackdropClick={false}
        render={({ onClose, data }) => (
          <Body
            onClose={() => {
              if (data.onCancel) {
                data.onCancel();
              }
              onClose();
            }}
            params={data || {}}
          />
        )}
      />
    );
  }
}

export default RequestAccountModal;
