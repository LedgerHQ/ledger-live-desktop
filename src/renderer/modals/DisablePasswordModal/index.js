// @flow

import React, { useState, useCallback } from "react";
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

type MaybePasswordIncorrectError = ?PasswordIncorrectError;

const DisablePasswordModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState<MaybePasswordIncorrectError>(null);

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_DISABLE_PASSWORD"));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    setCurrentPassword("");
    setIncorrectPassword(null);
  }, []);

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

  const handleChangePassword = useCallback(
    (password: ?string) => {
      setPassword(password);
      onClose();
    },
    [setPassword, onClose],
  );

  const disablePassword = useCallback(
    async (e: SyntheticEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      if (!(await isEncryptionKeyCorrect("app", "accounts", currentPassword))) {
        setIncorrectPassword(new PasswordIncorrectError());
        return;
      }

      handleChangePassword("");
    },
    [currentPassword, handleChangePassword],
  );

  const handleInputChange = useCallback(
    (key: string) => (value: string) => {
      if (incorrectPassword) {
        setIncorrectPassword(null);
      }
      if (key === "currentPassword") {
        setCurrentPassword(value);
      }
    },
    [incorrectPassword, setIncorrectPassword, setCurrentPassword],
  );

  return (
    <Modal name="MODAL_DISABLE_PASSWORD" centered onHide={handleReset} onClose={onClose}>
      <form onSubmit={disablePassword}>
        <ModalBody
          onClose={onClose}
          title={t("password.disablePassword.title")}
          render={() => (
            <Box ff="Inter" color="palette.text.shade80" fontSize={4} textAlign="center" px={4}>
              {t("password.disablePassword.desc")}
              <Box px={7} mt={4} flow={3}>
                <Box flow={1}>
                  <Label htmlFor="password">
                    {t("password.inputFields.currentPassword.label")}
                  </Label>
                  <InputPassword
                    autoFocus
                    type="password"
                    data-test-id="disable-password-input"
                    onChange={handleInputChange("currentPassword")}
                    value={currentPassword}
                    error={incorrectPassword}
                  />
                </Box>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
              <Button small type="button" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button
                small
                primary
                onClick={disablePassword}
                disabled={!currentPassword && !incorrectPassword}
                data-test-id="modal-save-button"
              >
                {t("common.save")}
              </Button>
            </Box>
          )}
        />
      </form>
    </Modal>
  );
};

export default DisablePasswordModal;
