// @flow

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useDispatch } from "react-redux";
import Button from "~/renderer/components/Button";
import RepairModal from "~/renderer/modals/RepairModal";
import { command } from "~/renderer/commands";
import logger from "~/logger";
import { useHistory } from "react-router-dom";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { openModal, closeModal } from "~/renderer/actions/modals";

type Props = {
  buttonProps?: *,
  onRepair?: boolean => void,
  Component?: any,
};

const RepairDeviceButton = ({ onRepair, buttonProps, Component }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const timeout = useRef(null);
  const sub = useRef(null);

  const history = useHistory();

  useEffect(() => {
    return () => {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
      }

      if (sub && sub.current) sub.current.unsubscribe();
    };
  }, []);

  const open = useCallback(() => {
    setError(null);
    // NB due to the fact that this modal is not part of the modals layer, we need to dispatch the open modal
    // event to have the backdrop layer added. I'm not refactoring the modal because of fear.
    dispatch(openModal("MODAL_STUB"));
    setOpened(true);
  }, [dispatch]);

  const close = useCallback(() => {
    if (sub && sub.current) sub.current.unsubscribe();
    if (timeout && timeout.current) clearTimeout(timeout.current);
    if (onRepair) {
      onRepair(false);
    }
    setOpened(false);
    dispatch(closeModal("MODAL_STUB"));
    setIsLoading(false);
    setError(null);
    setProgress(0);
  }, [onRepair, dispatch]);

  const repair = useCallback(
    (version = null) => {
      if (isLoading) return;
      if (onRepair) {
        onRepair(true);
      }

      timeout.current = setTimeout(() => setIsLoading(true), 500);
      sub.current = command("firmwareRepair")({ version }).subscribe({
        next: ({ progress }) => {
          setIsLoading(isLoading);
          setProgress(progress);
        },
        error: error => {
          logger.critical(error);
          if (timeout.current) clearTimeout(timeout.current);
          setError(error);
          setIsLoading(false);
          setProgress(0);
        },
        complete: () => {
          if (timeout) clearTimeout(timeout.current);
          setOpened(false);
          setIsLoading(false);
          setProgress(0);
          setTrackingSource("repair device button");
          history.push({ pathname: "manager" });

          if (onRepair) {
            onRepair(false);
          }
        },
      });
    },
    [history, isLoading, onRepair],
  );

  return (
    <>
      {Component ? (
        <Component onClick={open} />
      ) : (
        <Button {...buttonProps} onClick={open} event="RepairDeviceButton">
          {t("settings.repairDevice.button")}
        </Button>
      )}
      <RepairModal
        cancellable
        analyticsName="RepairDevice"
        isOpened={opened}
        onClose={close}
        onReject={close}
        repair={repair}
        isLoading={isLoading}
        title={t("settings.repairDevice.title")}
        desc={t("settings.repairDevice.desc")}
        progress={progress}
        error={error}
      />
    </>
  );
};

export default RepairDeviceButton;
