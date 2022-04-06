// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { track } from "~/renderer/analytics/segment";
import { DeviceSelector } from "./DeviceSelector";

const SelectDeviceContainer: ThemedComponent<*> = styled.div`
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

export function SelectDevice() {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeviceSelect = useCallback(
    (deviceId: DeviceModelId) => {
      track("Onboarding Device - Selection", { deviceId });
      history.push(`/select-use-case/${deviceId}`);
    },
    [history],
  );

  return (
    <SelectDeviceContainer>
      <TopRightContainer>
        <Button small onClick={() => history.push("/terms")}>
          {t("common.previous")}
        </Button>
      </TopRightContainer>
      <Text mb="24px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
        {t("onboarding.screens.selectDevice.title")}
      </Text>
      <DeviceSelector onClick={handleDeviceSelect} />
    </SelectDeviceContainer>
  );
}
