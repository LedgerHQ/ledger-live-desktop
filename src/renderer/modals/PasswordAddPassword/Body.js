// @flow

import React from "react";
import { PasswordsDontMatchError } from "@ledgerhq/errors";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import InputPassword from "~/renderer/components/InputPassword";
import Label from "~/renderer/components/Label";

type Props = {
  onSubmit: Function,
  isValid: () => boolean,
  onChange: Function,
  newPassword: string,
  confirmPassword: string,
  name: string,
  description: string,
};

const PasswordBody = (props: Props) => {
  const { isValid, onChange, onSubmit, newPassword, confirmPassword, name, description } = props;
  const { t } = useTranslation();
  // TODO: adjust design to separate 3 fields
  return (
    <form onSubmit={onSubmit}>
      <Box px={7} mt={4} flow={3}>
        <Box flow={1}>
          <Label htmlFor="name">{t("llpassword.inputFields.name.label")}</Label>
          <Input style={{ mt: 4, width: 240 }} id="name" onChange={onChange("name")} value={name} />
        </Box>
        <Box flow={1}>
          <Label htmlFor="description">{t("llpassword.inputFields.description.label")}</Label>
          <Input style={{ mt: 4, width: 240 }} id="description" onChange={onChange("description")} value={description} />
        </Box>
        <Box flow={1}>
          <Label htmlFor="newPassword">{t("llpassword.inputFields.newPassword.label")}</Label>
          <InputPassword
            style={{ mt: 4, width: 240 }}
            id="newPassword"
            onChange={onChange("newPassword")}
            value={newPassword}
          />
        </Box>
        <Box flow={1}>
          <Label htmlFor="confirmPassword">
            {t("llpassword.inputFields.confirmPassword.label")}
          </Label>
          <InputPassword
            style={{ width: 240 }}
            id="confirmPassword"
            onChange={onChange("confirmPassword")}
            value={confirmPassword}
            error={!isValid() && confirmPassword.length > 0 && new PasswordsDontMatchError()}
          />
        </Box>
        <button hidden type="submit" />
      </Box>
    </form>
  );
};

export default PasswordBody;
