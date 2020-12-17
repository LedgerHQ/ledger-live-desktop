// @flow

import React, { useState, useEffect, useReducer } from "react";
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
  addResult: null,
  isNanoPassLoading: true,
  isAddingPass: false,
  error: null,
};
const reducer = (state, update) => ({
  ...state,
  ...update,
});
const createAction = connectAppExec => {
  const useHook = (reduxDevice, request) => {
    const appState = createAppAction(connectAppExec).useHook(reduxDevice, {
      appName: "nanopass",
    });

    const { device, opened } = appState;

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
      if (!opened || !device) {
        dispatch(initialState);
        return;
      }

      if (state.isAddingPass || state.addResult || state.error) {
        return;
      }

      dispatch({
        isAddingPass: true,
      });

      console.log("add", request);

      command("addNameAndPass")({
        deviceId: device.deviceId,
        name: request.name,
        description: request.description,
        password: request.password,
      })
        .toPromise()
        .then(
          result =>
            dispatch({
              addResult: true,
              isAddingPass: false,
              isNanoPassLoading: false,
            }),
          err =>
            dispatch({
              error: err,
              isAddingPass: false,
              isNanoPassLoading: false,
            }),
        );
    }, [
      device,
      opened,
      request.name,
      request.description,
      request.password,
      state.addResult,
      state.error,
      state.isAddingPass,
      request,
    ]);

    return {
      ...appState,
      ...state,
    };
  };

  return {
    useHook,
    mapResult: r => ({
      result: r.addResult,
      error: r.error,
    }),
  };
};

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : command("connectApp"));

type Props = {
  onUpdate: Function,
};

const PasswordAddPassword = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [onAddPassword, setOnAddPassword] = useState(false);

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

    setOnAddPassword({ name, description, password: newPassword });
  };

  const handleInputChange = (key: string) => (value: string) => {
    switch (key) {
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "description":
        setDescription(value);
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
    setDescription("");
  };

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      <Modal name="MODAL_PASSWORD_ADD_PASSWORD" centered>
        <ModalBody
          title={t("llpassword.addpassword.title")}
          onHide={handleReset}
          onClose={onClose}
          render={() => (
            <>
              {!onAddPassword ? (
                <Body
                  onSubmit={handleSave}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  name={name}
                  description={description}
                  isValid={isValid}
                  onChange={handleInputChange}
                  t={t}
                />
              ) : (
                <DeviceAction
                  onResult={() => {
                    onClose();
                    props.onUpdate();
                  }}
                  action={action}
                  request={{
                    name,
                    description,
                    password: newPassword,
                  }}
                />
              )}
            </>
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
                  onAddPassword ||
                  !isValid() ||
                  !newPassword.length ||
                  !confirmPassword.length ||
                  !name.length ||
                  !description.length
                }
                id="modal-save-button"
              >
                {t("common.save")}
              </Button>
            </Box>
          )}
        />
      </Modal>
    </>
  );
};

export default PasswordAddPassword;
