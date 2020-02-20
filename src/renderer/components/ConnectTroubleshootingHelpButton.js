// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { colors } from "~/renderer/styles/theme";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import IconHelp from "~/renderer/icons/Help";

const ConnectTroubleshootingHelpButton = () => {
  const { t } = useTranslation();

  return (
    <Button onClick={() => openURL(urls.troubleshootingUSB)} style={{ margin: "0 10px" }}>
      <Box color={colors.wallet} horizontal alignItems="center">
        <IconHelp size={16} />
        {" "}
        {t("common.help")}
      </Box>
    </Button>
  );
};

const ConnectTroubleshootingHelpButtonOut: React$ComponentType<{}> = React.memo(
  ConnectTroubleshootingHelpButton,
);

export default ConnectTroubleshootingHelpButtonOut;
