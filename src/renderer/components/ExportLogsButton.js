// @flow
import moment from "moment";
import { ipcRenderer, webFrame, remote } from "electron";
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getAllEnvs } from "@ledgerhq/live-common/lib/env";
import KeyHandler from "react-key-handler";
import logger from "~/logger";
import getUser from "~/helpers/user";
import Button from "~/renderer/components/Button";

const saveLogs = async (path: { canceled: boolean, filePath: string }) => {
  await ipcRenderer.invoke("save-logs", path);
};

type RestProps = {|
  icon?: boolean,
  inverted?: boolean, // only used with primary for now
  lighterPrimary?: boolean,
  danger?: boolean,
  lighterDanger?: boolean,
  disabled?: boolean,
  isLoading?: boolean,
  event?: string,
  eventProperties?: Object,
  outline?: boolean,
  outlineGrey?: boolean,
|};

type Props = {|
  ...RestProps,
  primary?: boolean,
  small?: boolean,
  hookToShortcut?: boolean,
  title?: React$Node,
  withoutAppData?: boolean,
|};

const ExportLogsBtn = ({ hookToShortcut, primary = true, small = true, title, ...rest }: Props) => {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  const exportLogs = useCallback(async () => {
    const resourceUsage = webFrame.getResourceUsage();
    const user = await getUser();
    logger.log("exportLogsMeta", {
      resourceUsage,
      release: __APP_VERSION__,
      git_commit: __GIT_REVISION__,
      environment: __DEV__ ? "development" : "production",
      userAgent: window.navigator.userAgent,
      userAnonymousId: user.id,
      env: {
        ...getAllEnvs(),
      },
    });
    const path = await remote.dialog.showSaveDialog({
      title: "Export logs",
      defaultPath: `ledgerlive-logs-${moment().format("YYYY.MM.DD-HH.mm.ss")}-${__GIT_REVISION__ ||
        "unversioned"}.json`,
      filters: [
        {
          name: "All Files",
          extensions: ["json"],
        },
      ],
    });

    if (path) {
      await saveLogs(path);
    }
  }, []);

  const handleExportLogs = useCallback(async () => {
    if (exporting) return;

    setExporting(true);

    try {
      await exportLogs();
    } catch (error) {
      logger.critical(error);
    } finally {
      setExporting(false);
    }
  }, [exporting, setExporting, exportLogs]);

  const onKeyHandle = useCallback(
    e => {
      if (e.ctrlKey) {
        handleExportLogs();
      }
    },
    [handleExportLogs],
  );

  const text = title || t("settings.exportLogs.btn");

  return hookToShortcut ? (
    <KeyHandler keyValue="e" onKeyHandle={onKeyHandle} />
  ) : (
    <Button small={small} primary={primary} event="ExportLogs" onClick={handleExportLogs} {...rest}>
      {text}
    </Button>
  );
};

export default ExportLogsBtn;
