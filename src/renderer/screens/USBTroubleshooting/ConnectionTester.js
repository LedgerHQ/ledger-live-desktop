// @flow
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Spinner from "~/renderer/components/Spinner";
import Button from "~/renderer/components/Button";
import { command } from "~/renderer/commands";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconCheckFull from "~/renderer/icons/CheckFull";
import { getDeviceAnimation } from "~/renderer/components/DeviceAction/animations";
import Animation from "~/renderer/animations";

const Wrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  min-height: 80px;
  padding: 20px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  border-radius: 8px;
`;

// NB There is no real need to run anything that's more complex than this.
// If we can do a getAppAndVersion, it means we can communicate with the device.
const ConnectionTester = ({ onExit }: { onExit: () => void }) => {
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState(0);
  const currentDevice = useSelector(getCurrentDevice);

  useEffect(() => {
    let sub;
    if (currentDevice) {
      // Nb if we haven't detected a device at all, there's no point in running the command
      sub = command("getAppAndVersion")({ deviceId: "" }).subscribe({
        next: e => setConnectionStatus(1),
      });
    }
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [currentDevice]);

  return (
    <Wrapper>
      <Animation
        height={"140px"}
        animation={getDeviceAnimation("nanoS", "light", "plugAndPinCode")}
        loop={connectionStatus !== 1}
      />
      {connectionStatus === 1 ? (
        <Box horizontal alignItems="center" justifyContent="center">
          <IconCheckFull size={16} />
          <Text ff="Inter|Medium" mx={2} fontSize={4} color="palette.primary.main">
            {t("connectTroubleshooting.connected")}
          </Text>
          <Button
            ml={2}
            primary
            onClick={onExit}
            event="USBTroubleshooting user success cta"
            id="USBTroubleshooting-backToPortfolio"
          >
            {t("connectTroubleshooting.backToPortfolio")}
          </Button>
        </Box>
      ) : (
        <Box color="palette.text.shade50" horizontal alignItems="center" justifyContent="center">
          <Spinner size={16} />
          <Text ff="Inter|Medium" fontSize={4} ml={2}>
            {t("connectTroubleshooting.connecting")}
          </Text>
        </Box>
      )}
    </Wrapper>
  );
};

export default ConnectionTester;
