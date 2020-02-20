// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { colors } from "~/renderer/styles/theme";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

const ConnectTroubleshootingHelpButton = () => {
  const { t } = useTranslation();

  return (
    <LinkWithExternalIcon
      onClick={() => openURL(urls.troubleshootingUSB)}
      style={{ margin: "0 10px" }}
    >
      <Box color={colors.wallet} horizontal alignItems="center">
        {t("common.help")}
      </Box>
    </LinkWithExternalIcon>
  );
};

const ConnectTroubleshootingHelpButtonOut: React$ComponentType<{}> = React.memo(
  ConnectTroubleshootingHelpButton,
);

export default ConnectTroubleshootingHelpButtonOut;
