// @flow

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button from "~/renderer/components/Button";
import RepairModal from "~/renderer/modals/RepairModal";
import { command } from "~/renderer/commands";
import logger from "~/logger";
import { useHistory } from "react-router-dom";

type Props = {
  buttonProps?: *,
  onRepair?: boolean => void,
};

const RepairDeviceButton = ({ onRepair, buttonProps }: Props) => {
  const { t } = useTranslation();
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
    setOpened(true);
  }, [setError, setOpened]);

  const close = useCallback(() => {
    if (sub && sub.current) sub.current.unsubscribe();
    if (timeout && timeout.current) clearTimeout(timeout.current);
    if (onRepair) {
      onRepair(false);
    }
    setOpened(false);
    setIsLoading(false);
    setError(null);
    setProgress(0);
  }, [sub, timeout, onRepair, setOpened, setIsLoading, setError, setProgress]);

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
          history.push({ pathname: "manager", state: { source: "repair device button" } });

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
      <Button {...buttonProps} onClick={open} event="RepairDeviceButton">
        {t("settings.repairDevice.button")}
      </Button>
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
