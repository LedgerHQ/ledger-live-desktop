// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import AccountSettingRenderBody from "~/renderer/modals/SettingsAccount/AccountSettingRenderBody";

export default class SettingsAccount extends PureComponent<*, *> {
  render() {
    return (
      <Modal
        name="MODAL_SETTINGS_ACCOUNT"
        centered
        render={({ data, onClose }) => (
          <AccountSettingRenderBody {...this.props} data={data} onClose={onClose} />
        )}
      />
    );
  }
}
