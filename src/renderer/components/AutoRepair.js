// @flow

import React, { useState, useEffect } from "react";
import noop from "lodash/noop";
import { Trans } from "react-i18next";
import { command } from "~/renderer/commands";
import logger from "~/logger/logger";
import RepairModal from "~/renderer/modals/RepairModal";

type Props = {
  onDone: () => void,
};

const AutoRepair = ({ onDone }: Props) => {
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const sub = command("firmwareRepair")({ version: null }).subscribe({
      next: patch => {
        if ("progress" in patch) {
          setProgress(patch.progress);
        }
      },
      error: error => {
        logger.critical(error);
        setError(error);
      },
      complete: () => onDone(),
    });
    return () => sub.unsubscribe();
  }, [onDone]);

  return (
    <RepairModal
      isAlreadyBootloader
      cancellable
      analyticsName="RepairDevice"
      isOpened
      isLoading
      onClose={onDone}
      onReject={onDone}
      repair={noop}
      desc={<Trans i18nKey="settings.repairDevice.desc" />}
      progress={progress}
      error={error}
    />
  );
};

export default AutoRepair;
