// @flow

import React, { useState, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { closeModal } from "~/renderer/actions/modals";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
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

      console.log("remove");

      command("removePass")({
        deviceId: device.deviceId,
        name: request.name,
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
      request.password,
      state.addResult,
      state.error,
      state.isAddingPass,
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
  passName: string,
};

const PasswordRemovePassword = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [onAddPassword, setOnAddPassword] = useState(false);

  console.log("cxoucouou");

  const onClose = () => {
    dispatch(closeModal("MODAL_PASSWORD_REMOVE_PASSWORD"));
  };

  const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    setOnAddPassword(true);
  };

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      <Modal name="MODAL_PASSWORD_REMOVE_PASSWORD" centered>
        <ModalBody
          title={t("llpassword.addpassword.title")}
          onHide={() => {}}
          onClose={onClose}
          render={() => (
            <>
              {!onAddPassword ? (
                <span>Are you sure you want to delete {props.passName} ?</span>
              ) : (
                <DeviceAction
                  onResult={() => {
                    onClose();
                    props.onUpdate();
                  }}
                  action={action}
                  request={{
                    name: props.passName,
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
                disabled={onAddPassword}
                id="modal-save-button"
              >
                Remove
              </Button>
            </Box>
          )}
        />
      </Modal>
    </>
  );
};

export default PasswordRemovePassword;
