import React, { useState, useCallback, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { PasswordIncorrectError } from "@ledgerhq/errors";
import { useTranslation } from "react-i18next";
import { setEncryptionKey, removeEncryptionKey, isEncryptionKeyCorrect } from "~/renderer/storage";
import { closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import InputPassword from "~/renderer/components/InputPassword";
import Label from "~/renderer/components/Label";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { setHasPassword } from "~/renderer/actions/application";
import { Flex, Text } from "@ledgerhq/react-ui";

// TypesScript fix for javaScript class creator imported from @ledgerhq/errors
interface PasswordIncorrectErrorClass {
  message: string;
  name: string;
  fields?: {
    [key: string]: any;
  };
  stack?: string;
}
const PasswordIncorrectErrorClass = (PasswordIncorrectError as any) as {
  new (): PasswordIncorrectErrorClass;
};
type MaybePasswordIncorrectError = PasswordIncorrectErrorClass | undefined;

const DisablePasswordModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState<MaybePasswordIncorrectError>();

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_DISABLE_PASSWORD"));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    setCurrentPassword("");
    setIncorrectPassword(undefined);
  }, []);

  const setPassword = useCallback(
    async (password?: string) => {
      if (password) {
        dispatch(setHasPassword(true));
        await setEncryptionKey("app", "accounts", password);
      } else {
        dispatch(setHasPassword(false));
        await removeEncryptionKey("app", "accounts");
      }
    },
    [dispatch],
  );

  const handleChangePassword = useCallback(
    (password?: string) => {
      setPassword(password);
      onClose();
    },
    [setPassword, onClose],
  );

  const disablePassword = useCallback(
    async (e?: SyntheticEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      if (!(await isEncryptionKeyCorrect("app", "accounts", currentPassword))) {
        setIncorrectPassword(new PasswordIncorrectErrorClass());
        return;
      }

      handleChangePassword("");
    },
    [currentPassword, handleChangePassword],
  );

  const handleInputChange = useCallback(
    (key: string) => (value: string) => {
      if (incorrectPassword) {
        setIncorrectPassword(undefined);
      }
      if (key === "currentPassword") {
        setCurrentPassword(value);
      }
    },
    [incorrectPassword, setIncorrectPassword, setCurrentPassword],
  );

  return (
    <Modal name="MODAL_DISABLE_PASSWORD" centered onHide={handleReset} onClose={onClose}>
      <ModalBody
        onClose={onClose}
        title={t("password.disablePassword.title")}
        render={() => (
          <Flex flexDirection="column" rowGap={5} mt={8} px={4}>
            <Text ff="Inter|Medium" color="neutral.c80" fontSize={4} textAlign="center">
              {t("password.disablePassword.desc")}
            </Text>
            <Flex flexDirection="column" rowGap={3}>
              <Label htmlFor="password">{t("password.inputFields.currentPassword.label")}</Label>
              <InputPassword
                onEnter={disablePassword}
                onChange={handleInputChange("currentPassword")}
                value={currentPassword}
                error={incorrectPassword}
              />
            </Flex>
          </Flex>
        )}
        renderFooter={() => (
          <Flex alignItems="center" justifyContent="flex-end" columnGap={5} flexGrow={1}>
            <Button variant="shade" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              small
              primary
              onClick={disablePassword}
              disabled={!currentPassword && !incorrectPassword}
            >
              {t("common.save")}
            </Button>
          </Flex>
        )}
      />
    </Modal>
  );
};

export default DisablePasswordModal;
