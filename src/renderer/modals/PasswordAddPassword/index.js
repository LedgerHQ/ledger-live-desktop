// @flow

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { closeModal } from "~/renderer/actions/modals";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Body from "./Body";
import { createAction as createAppAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const initialState = {
  getNamesError: null,
  getNamesResult: null,
  isNanoPassLoading: true,
};
const createAction = connectAppExec => {
  const useHook = (reduxDevice, request) => {
    const appState = createAppAction(connectAppExec).useHook(reduxDevice, {
      appName: "nanopass",
    });

    const { device, opened } = appState;

    const [state, setState] = useState(initialState);

    useEffect(() => {
      if (!opened || !device) {
        setState(initialState);
        return;
      }

      command("addNameAndPass")({
        deviceId: device.deviceId,
        name: request.name,
        password: request.password,
      })
        .toPromise()
        .then(
          result =>
            setState({
              ...state,
              getNamesResult: result,
              isNanoPassLoading: false,
            }),
          err =>
            setState({
              ...state,
              getNamesError: err,
              isNanoPassLoading: false,
            }),
        );
    }, [device, opened, request.name, request.password, state]);

    return {
      ...appState,
      ...state,
    };
  };

  return {
    useHook,
    mapResult: r => ({
      names: r.getNamesResult,
      error: r.getNamesError,
    }),
  };
};

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : command("connectApp"));

type Props = {
  onAddPassword: Function,
};

const PasswordAddPassword = (props: Props) => {
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

    props.onAddPassword({ name, newPassword });

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
