import React, { useState, useCallback, SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PasswordIncorrectError } from "@ledgerhq/errors";
import { closeModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { Flex, Text } from "@ledgerhq/react-ui";
import PasswordForm from "./PasswordForm";
import { setEncryptionKey, removeEncryptionKey, isEncryptionKeyCorrect } from "~/renderer/storage";
import { hasPasswordSelector } from "~/renderer/reducers/application";
import { setHasPassword } from "~/renderer/actions/application";

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

const PasswordModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hasPassword = useSelector(hasPasswordSelector);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState<MaybePasswordIncorrectError>();

  const isValid = useCallback(() => confirmPassword === newPassword, [
    confirmPassword,
    newPassword,
  ]);

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

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_PASSWORD"));
  }, [dispatch]);

  const handleChangePassword = useCallback(
    (password?: string) => {
      setPassword(password);
      onClose();
    },
    [setPassword, onClose],
  );

  const handleSave = useCallback(async () => {
    if (!isValid()) {
      return;
    }

    if (hasPassword) {
      if (!(await isEncryptionKeyCorrect("app", "accounts", currentPassword))) {
        setIncorrectPassword(new PasswordIncorrectErrorClass());
        return;
      }
      handleChangePassword(newPassword);
    } else {
      handleChangePassword(newPassword);
    }
  }, [
    currentPassword,
    newPassword,
    hasPassword,
    handleChangePassword,
    setIncorrectPassword,
    isValid,
  ]);

  const handleInputChange = useCallback(
    (key: string) => (value: string) => {
      if (incorrectPassword) {
        setIncorrectPassword(undefined);
      }

      switch (key) {
        case "currentPassword":
          setCurrentPassword(value);
          break;
        case "newPassword":
          setNewPassword(value);
          break;
        case "confirmPassword":
          setConfirmPassword(value);
          break;
        default:
          break;
      }
    },
    [
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
      incorrectPassword,
      setIncorrectPassword,
    ],
  );

  const handleReset = useCallback(() => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIncorrectPassword(undefined);
  }, [setCurrentPassword, setNewPassword, setConfirmPassword, setIncorrectPassword]);
  return (
    <Modal name="MODAL_PASSWORD" onClose={onClose} centered onHide={handleReset}>
      <ModalBody
        title={hasPassword ? t("password.changePassword.title") : t("password.setPassword.title")}
        onClose={onClose}
        render={() => (
          <Flex flexDirection="column" rowGap={5} mt={8}>
            <Text ff="Inter|Regular" color="neutral.c100" textAlign="center">
              {hasPassword
                ? t("password.changePassword.subTitle")
                : t("password.setPassword.subTitle")}
            </Text>
            <Text ff="Inter|Light" color="neutral.c80" fontSize={4} textAlign="center" px={4}>
              {t("password.setPassword.desc")}
            </Text>
            <PasswordForm
              onSubmit={handleSave}
              hasPassword={hasPassword}
              newPassword={newPassword}
              currentPassword={currentPassword}
              confirmPassword={confirmPassword}
              incorrectPassword={incorrectPassword}
              isValid={isValid}
              onChange={handleInputChange}
            />
          </Flex>
        )}
        renderFooter={() => (
          <Flex alignItems="center" justifyContent="flex-end" flexGrow={1} columnGap={5}>
            <Button variant="shade" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="main"
              onClick={handleSave}
              disabled={!isValid() || !newPassword.length || !confirmPassword.length}
            >
              {t("common.save")}
            </Button>
          </Flex>
        )}
      />
    </Modal>
  );
};

export default PasswordModal;
