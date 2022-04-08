// @flow

import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { DeviceModelId } from "@ledgerhq/devices";
import { Text } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Button from "~/renderer/components/Button";
import { DeviceSelector } from "./DeviceSelector";
import { track } from "~/renderer/analytics/segment";

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

export function SelectDevice() {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeviceSelect = useCallback(
    (deviceId: DeviceModelId) => {
      track("Onboarding Device - Selection", { deviceId });
      history.push(`/onboarding/select-use-case/${deviceId}`);
    },
    [history],
  );

  return (
    <SelectDeviceContainer>
      <TopRightContainer>
        <Button small onClick={() => history.push("/onboarding/terms")}>
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
