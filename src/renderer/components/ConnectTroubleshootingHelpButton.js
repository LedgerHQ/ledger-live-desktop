// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import IconHelp from "~/renderer/icons/Help";

type Props = {
  buttonProps?: *,
  textColor?: string,
};

const ConnectTroubleshootingHelpButton = ({ buttonProps, textColor }: Props) => {
  const { t } = useTranslation();
  const boxProps = textColor ? { color: textColor } : {};

  return (
    <Button
      onClick={() => openURL(urls.troubleshootingUSB)}
      style={{ margin: "0 10px" }}
      {...buttonProps}
    >
      <Box horizontal alignItems="center" {...boxProps}>
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
