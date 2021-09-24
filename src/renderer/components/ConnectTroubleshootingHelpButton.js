// @flow

import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { closeAllModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";

type Props = {
  buttonProps?: *,
  textColor?: string,
};

const ConnectTroubleshootingHelpButton = ({ buttonProps, textColor }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const onStartTroubleshootingFlow = useCallback(() => {
    history.push({ pathname: "USBTroubleshooting" });
    dispatch(closeAllModal());
  }, [dispatch, history]);

  return (
    <Button onClick={onStartTroubleshootingFlow} my={1} {...buttonProps}>
      <Box horizontal alignItems="center" color={textColor} id="USBTroubleshooting-startFlow">
        {t("connectTroubleshooting.cta")}
      </Box>
    </Button>
  );
};

const ConnectTroubleshootingHelpButtonOut: React$ComponentType<{}> = React.memo(
  ConnectTroubleshootingHelpButton,
);

export default ConnectTroubleshootingHelpButtonOut;
