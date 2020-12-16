// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { closeModal } from "~/renderer/actions/modals";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Body from "./Body";

const PasswordAddPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const isValid = () => confirmPassword === newPassword;

  const onClose = () => {
    dispatch(closeModal("MODAL_PASSWORD_ADD_PASSWORD"));
  };

  const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!isValid()) {
      return;
    }

    console.log("save");

    onClose();
  };

  const handleInputChange = (key: string) => (value: string) => {
    switch (key) {
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "name":
        setName(value);
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Modal name="MODAL_PASSWORD_ADD_PASSWORD" centered>
      <ModalBody
        title={t("llpassword.addpassword.title")}
        onHide={handleReset}
        onClose={onClose}
        render={() => (
          <Body
            onSubmit={handleSave}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            name={name}
            isValid={isValid}
            onChange={handleInputChange}
            t={t}
          />
        )}
        renderFooter={() => (
          <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
            <Button small type="button" onClick={onClose} id="modal-cancel-button">
              {t("common.cancel")}
            </Button>
            <Button
              small
              primary
              onClick={handleSave}
              disabled={
                !isValid() || !newPassword.length || !confirmPassword.length || !name.length
              }
              id="modal-save-button"
            >
              {t("common.save")}
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default PasswordAddPassword;
