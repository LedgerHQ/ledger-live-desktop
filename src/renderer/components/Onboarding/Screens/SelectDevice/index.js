// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { DeviceSelector } from "./DeviceSelector";
import Button from "~/renderer/components/Button";

const SelectDeviceContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TopRightContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
`;

export function SelectDevice({ sendEvent }) {
  const { t } = useTranslation();

  const handleDeviceSelect = useCallback((deviceId: string) => {
    sendEvent({ type: "DEVICE_SELECTED", deviceId });
  }, []);

  return (
    <SelectDeviceContainer>
      <TopRightContainer>
        <Button small onClick={() => sendEvent("PREV")}>
          Previous
        </Button>
      </TopRightContainer>
      <Text mb="24px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
        {t("onboarding.screens.selectDevice.title")}
      </Text>
      <DeviceSelector onClick={handleDeviceSelect} />
    </SelectDeviceContainer>
  );
}
