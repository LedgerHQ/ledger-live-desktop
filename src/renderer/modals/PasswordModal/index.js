// @flow

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PasswordIncorrectError } from "@ledgerhq/errors";
import { closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import PasswordForm from "./PasswordForm";
import { setEncryptionKey, removeEncryptionKey, isEncryptionKeyCorrect } from "~/renderer/storage";
import { hasPasswordSelector } from "~/renderer/reducers/application";
import { setHasPassword } from "~/renderer/actions/application";

type MaybePasswordIncorrectError = ?PasswordIncorrectError;

const PasswordModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hasPassword = useSelector(hasPasswordSelector);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState<MaybePasswordIncorrectError>(null);

  const isValid = useCallback(() => confirmPassword === newPassword, [
    confirmPassword,
    newPassword,
  ]);

  const setPassword = useCallback(
    async (password: ?string) => {
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
    (password: ?string) => {
      setPassword(password);
      onClose();
    },
    [setPassword, onClose],
  );

  const handleSave = useCallback(
    async (e: SyntheticEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      if (!isValid()) {
        return;
      }

      if (hasPassword) {
        if (!(await isEncryptionKeyCorrect("app", "accounts", currentPassword))) {
          setIncorrectPassword(new PasswordIncorrectError());
          return;
        }
        handleChangePassword(newPassword);
      } else {
        handleChangePassword(newPassword);
      }
    },
    [
      currentPassword,
      newPassword,
      hasPassword,
      handleChangePassword,
      setIncorrectPassword,
      isValid,
    ],
  );

  const handleInputChange = useCallback(
    (key: string) => (value: string) => {
      if (incorrectPassword) {
        setIncorrectPassword(null);
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
    setIncorrectPassword(null);
  }, [setCurrentPassword, setNewPassword, setConfirmPassword, setIncorrectPassword]);
  return (
    <Modal name="MODAL_PASSWORD" onClose={onClose} centered>
      <ModalBody
        title={hasPassword ? t("password.changePassword.title") : t("password.setPassword.title")}
        onHide={handleReset}
        onClose={onClose}
        render={() => (
          <>
            <Box ff="Inter|Regular" color="palette.text.shade100" textAlign="center" mb={2} mt={3}>
              {hasPassword
                ? t("password.changePassword.subTitle")
                : t("password.setPassword.subTitle")}
            </Box>
            <Box ff="Inter" color="palette.text.shade80" fontSize={4} textAlign="center" px={4}>
              {t("password.setPassword.desc")}
            </Box>
            <PasswordForm
              onSubmit={handleSave}
              hasPassword={hasPassword}
              newPassword={newPassword}
              currentPassword={currentPassword}
              confirmPassword={confirmPassword}
              incorrectPassword={incorrectPassword}
              isValid={isValid}
              onChange={handleInputChange}
              t={t}
            />
          </>
        )}
        renderFooter={() => (
          <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
            <Button small type="button" onClick={onClose} data-test-id="modal-cancel-button">
              {t("common.cancel")}
            </Button>
            <Button
              small
              primary
              onClick={handleSave}
              disabled={!isValid() || !newPassword.length || !confirmPassword.length}
              data-test-id="modal-save-button"
            >
              {t("common.save")}
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default PasswordModal;
