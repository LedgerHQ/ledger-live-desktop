// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { DeviceModelId } from "@ledgerhq/devices";
import { Text } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Button from "~/renderer/components/Button";
import { DeviceSelector } from "./DeviceSelector";

const SelectDeviceContainer: ThemedComponent<any> = styled.div`
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

const TitleText = styled(Text)`
  position: absolute;
  top: 90px;
  align-self: center;
  color: ${p => p.theme.colors.palette.neutral.c100};
  pointer-events: none;
`;

interface Props {
  sendEvent: (arg1: { type: string; deviceId: DeviceModelId } | string) => any;
}

export function SelectDevice({ sendEvent }: Props) {
  const { t } = useTranslation();

  const handleDeviceSelect = useCallback(
    (deviceId: DeviceModelId) => {
      sendEvent({ type: "DEVICE_SELECTED", deviceId });
    },
    [sendEvent],
  );

  return (
    <SelectDeviceContainer>
      <TopRightContainer>
        <Button small onClick={() => sendEvent("PREV")}>
          {t("common.previous")}
        </Button>
      </TopRightContainer>
      <DeviceSelector onClick={handleDeviceSelect} />
      <TitleText variant="h3" fontSize="28px" ff="Alpha|Medium">
        {t("v3.onboarding.screens.selectDevice.title")}
      </TitleText>
    </SelectDeviceContainer>
  );
}
