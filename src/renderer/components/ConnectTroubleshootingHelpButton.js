// @flow

import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";

type Props = {
  buttonProps?: *,
  textColor?: string,
};

const ConnectTroubleshootingHelpButton = ({ buttonProps, textColor }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onStartTroubleshootingFlow = useCallback(() => {
    history.push({ pathname: "USBTroubleshooting" });
  }, [history]);

  return (
    <Button onClick={onStartTroubleshootingFlow} my={1} {...buttonProps}>
      <Box horizontal alignItems="center" color={textColor} id="USBTroubleshooting-startFlow">
        {t("common.help")}
      </Box>
    </Button>
  );
};

const ConnectTroubleshootingHelpButtonOut: React$ComponentType<{}> = React.memo(
  ConnectTroubleshootingHelpButton,
);

export default ConnectTroubleshootingHelpButtonOut;
