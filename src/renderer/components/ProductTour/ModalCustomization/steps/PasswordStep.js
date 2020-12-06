// @flow
import React, { useEffect, useState, useMemo } from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InputPassword from "~/renderer/components/InputPassword";
import Label from "~/renderer/components/Label";
import { PasswordsDontMatchError } from "@ledgerhq/errors";

const PasswordStep = ({
  onNext,
  setCanContinue,
}: {
  onNext: () => void,
  setCanContinue: boolean => void,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValid = useMemo(
    () =>
      (!newPassword.length && !confirmPassword.length) ||
      (newPassword.length > 0 && newPassword === confirmPassword),
    [confirmPassword, newPassword],
  );

  useEffect(() => {
    setCanContinue(isValid);
  }, [isValid, setCanContinue]);

  return (
    <Box alignItems="center" px={40} pt={20} color={"palette.text.shade60"}>
      <Text ff={"Inter|Regular"} fontSize={4} textAlign={"center"}>
        <Trans i18nKey={"productTour.flows.customize.modal.password.help"} />
      </Text>
      <Box flow={1} mt={32}>
        <Label htmlFor="newPassword">
          <Trans i18nKey="password.inputFields.newPassword.label" />
        </Label>
        <InputPassword
          style={{ mt: 4, width: 240 }}
          autoFocus
          id="newPassword"
          onChange={setNewPassword}
          value={newPassword}
        />
      </Box>
      <Box flow={1} mt={3}>
        <Label htmlFor="confirmPassword">
          <Trans i18nKey="password.inputFields.confirmPassword.label" />
        </Label>
        <InputPassword
          style={{ width: 240 }}
          onEnter={isValid ? onNext : undefined}
          id="confirmPassword"
          onChange={setConfirmPassword}
          value={confirmPassword}
          error={!isValid && confirmPassword.length > 0 && new PasswordsDontMatchError()}
        />
      </Box>
    </Box>
  );
};

export default PasswordStep;
