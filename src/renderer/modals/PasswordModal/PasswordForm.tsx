import React from "react";
import { PasswordsDontMatchError } from "@ledgerhq/errors";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import InputPassword from "~/renderer/components/InputPassword";
import Label from "~/renderer/components/Label";

import { Flex } from "@ledgerhq/react-ui";

// TypesScript fix for javaScript class creator imported from @ledgerhq/errors
interface PasswordsDontMatchErrorClass {
  message: string;
  name: string;
  fields?: {
    [key: string]: any;
  };
  stack?: string;
}
const PasswordsDontMatchErrorClass = (PasswordsDontMatchError as any) as {
  new (): PasswordsDontMatchErrorClass;
};

type Props = {
  hasPassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  incorrectPassword?: Error;
  onSubmit: () => void;
  isValid: () => boolean;
  onChange: (key: string) => (value: string) => void;
};

const PasswordForm = ({
  hasPassword,
  currentPassword,
  newPassword,
  incorrectPassword,
  confirmPassword,
  isValid,
  onChange,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Flex px={7} mt={4} flexDirection="column" rowGap={3}>
        {hasPassword && (
          <Flex flexGrow={1} flexDirection="column" rowGap={3}>
            <Label htmlFor="currentPassword">
              {t("password.inputFields.currentPassword.label")}
            </Label>
            <InputPassword
              onChange={onChange("currentPassword")}
              value={currentPassword}
              error={incorrectPassword}
            />
          </Flex>
        )}
        <Flex flexDirection="column" rowGap={3}>
          <Label htmlFor="newPassword">{t("password.inputFields.newPassword.label")}</Label>
          <InputPassword onChange={onChange("newPassword")} value={newPassword} />
        </Flex>
        <Flex flexDirection="column" rowGap={3}>
          <Label htmlFor="confirm-password-input">
            {t("password.inputFields.confirmPassword.label")}
          </Label>
          <InputPassword
            onEnter={onSubmit}
            onChange={onChange("confirmPassword")}
            value={confirmPassword}
            error={
              !isValid() && confirmPassword.length > 0
                ? new PasswordsDontMatchErrorClass()
                : undefined
            }
          />
        </Flex>
        <button hidden type="submit" />
      </Flex>
    </form>
  );
};

export default PasswordForm;
