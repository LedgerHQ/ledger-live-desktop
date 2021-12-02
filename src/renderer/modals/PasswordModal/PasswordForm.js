// @flow

import React, { PureComponent } from "react";
import { PasswordsDontMatchError } from "@ledgerhq/errors";
import type { TFunction } from "react-i18next";
import Box from "~/renderer/components/Box";
import InputPassword from "~/renderer/components/InputPassword";
import Label from "~/renderer/components/Label";

type Props = {
  t: TFunction,
  hasPassword: boolean,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword?: ?Error,
  onSubmit: Function,
  isValid: () => boolean,
  onChange: Function,
};

class PasswordForm extends PureComponent<Props> {
  render() {
    const {
      t,
      hasPassword,
      currentPassword,
      newPassword,
      incorrectPassword,
      confirmPassword,
      isValid,
      onChange,
      onSubmit,
    } = this.props;
    // TODO: adjust design to separate 3 fields
    return (
      <form onSubmit={onSubmit}>
        <Box px={7} mt={4} flow={3}>
          {hasPassword && (
            <Box flow={1} mb={5}>
              <Label htmlFor="currentPassword">
                {t("password.inputFields.currentPassword.label")}
              </Label>
              <InputPassword
                autoFocus
                data-test-id="current-password-input"
                onChange={onChange("currentPassword")}
                value={currentPassword}
                error={incorrectPassword}
              />
            </Box>
          )}
          <Box flow={1}>
            <Label htmlFor="newPassword">{t("password.inputFields.newPassword.label")}</Label>
            <InputPassword
              style={{ mt: 4, width: 240 }}
              autoFocus={!hasPassword}
              data-test-id="new-password-input"
              onChange={onChange("newPassword")}
              value={newPassword}
            />
          </Box>
          <Box flow={1}>
            <Label htmlFor="confirm-password-input">
              {t("password.inputFields.confirmPassword.label")}
            </Label>
            <InputPassword
              style={{ width: 240 }}
              onEnter={onSubmit}
              data-test-id="confirm-password-input"
              onChange={onChange("confirmPassword")}
              value={confirmPassword}
              error={!isValid() && confirmPassword.length > 0 && new PasswordsDontMatchError()}
            />
          </Box>
          <button hidden type="submit" />
        </Box>
      </form>
    );
  }
}

export default PasswordForm;
