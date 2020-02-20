// @flow

import React, { useCallback } from "react";
import { shell } from "electron";
import { useTranslation } from "react-i18next";
import logger from "~/logger";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import Button from "~/renderer/components/Button";

const OpenUserDataDirectoryBtn = () => {
  const { t } = useTranslation();
  const handleOpenUserDataDirectory = useCallback(() => {
    const userDataDirectory = resolveUserDataDirectory();
    logger.log(`Opening user data directory: ${userDataDirectory}`);
    shell.openItem(userDataDirectory);
  }, []);

  return (
    <Button primary small onClick={handleOpenUserDataDirectory}>
      {t("settings.openUserDataDirectory.btn")}
    </Button>
  );
};

export default OpenUserDataDirectoryBtn;
