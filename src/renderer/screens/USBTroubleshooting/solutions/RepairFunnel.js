// @flow
import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { Wrapper, Content, Title, Subtitle, Illustration } from "./shared";
import illustration from "~/renderer/images/USBTroubleshooting/fail.png";
import { DeviceSelector } from "~/renderer/components/Onboarding/Screens/SelectDevice/DeviceSelector";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import RepairDeviceButton from "~/renderer/components/RepairDeviceButton";

const RepairFunnelSolution = ({
  sendEvent,
  done,
}: {
  sendEvent: (string, ?{}) => void,
  done: boolean,
}) => {
  const { t } = useTranslation();
  const repairRef = useRef<any>();

  const onContactSupport = useCallback(() => {
    openURL(urls.contactSupport);
  }, []);

  const onSelectDevice = useCallback(
    deviceModel => {
      if (deviceModel === "nanoS") {
        // NB click forwarded into the repair button.
        repairRef.current?.click();
      } else {
        sendEvent("DONE", { deviceModel });
      }
    },
    [repairRef, sendEvent],
  );

  return !done ? (
    <Wrapper>
      <Title>{t("connectTroubleshooting.steps.4.deviceSelection.title")}</Title>
      <Subtitle style={{ padding: "0 50px" }} mb={36} mt={12}>
        {t("connectTroubleshooting.steps.4.deviceSelection.desc")}
      </Subtitle>
      <div style={{ display: "none" }}>
        <RepairDeviceButton ref={repairRef} />
      </div>
      <DeviceSelector onClick={onSelectDevice} />
    </Wrapper>
  ) : (
    <Wrapper>
      <Content>
        <Illustration height={193} image={illustration} />
      </Content>
      <Title>{t("connectTroubleshooting.steps.4.notFixed.title")}</Title>
      <Subtitle style={{ padding: "0 50px" }} mb={36} mt={12}>
        {t("connectTroubleshooting.steps.4.notFixed.desc")}
      </Subtitle>
      <Box horizontal>
        <Button primary onClick={onContactSupport}>
          {t("connectTroubleshooting.steps.4.notFixed.cta")}
        </Button>
      </Box>
    </Wrapper>
  );
};

export default RepairFunnelSolution;
