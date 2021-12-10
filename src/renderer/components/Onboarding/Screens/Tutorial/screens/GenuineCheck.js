// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import IconCheck from "~/renderer/icons/Check";
import { ContentContainer } from "../shared";
import DeviceAction from "~/renderer/components/DeviceAction";
import { setLastSeenDeviceInfo } from "~/renderer/actions/settings";
import { useDispatch } from "react-redux";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { command } from "~/renderer/commands";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const ScreenContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
`;

const ContentFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SuccessContainer = styled(Content)`
  flex-direction: column;
  max-width: 250px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${p => rgba(p.theme.colors.positiveGreen, 0.1)};
  color: ${p => p.theme.colors.positiveGreen};
  width: 48px;
  height: 48px;
`;

const Success = ({ device }: { device: Device }) => {
  const { t } = useTranslation();
  return (
    <SuccessContainer>
      <IconContainer>
        <IconCheck size={18} />
      </IconContainer>
      <Text mt={3} ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100">
        <Trans i18nKey="onboarding.screens.tutorial.screens.genuineCheck.success.title" />
      </Text>
      <Text mt={2} ff="Inter|Regular" fontSize={4} textAlign="center" color="palette.text.shade100">
        <Trans
          i18nKey="onboarding.screens.tutorial.screens.genuineCheck.success.desc"
          values={{ deviceName: t(`devices.${device.modelId}`) }}
        />
      </Text>
    </SuccessContainer>
  );
};

type Props = {
  sendEvent: any => void,
  context: {
    deviceId: DeviceModelId,
    device?: Device,
  },
};

export function GenuineCheck({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { deviceId, device } = context;

  const reduxDispatch = useDispatch();
  const onClickNext = useCallback(() => sendEvent("NEXT"), [sendEvent]);
  const onClickPrev = useCallback(() => sendEvent("PREV"), [sendEvent]);

  const onResult = useCallback(
    res => {
      const { device, deviceInfo, result } = res;
      sendEvent({ type: "GENUINE_CHECK_SUCCESS", device: res.device });
      const lastSeenDevice = {
        modelId: device.modelId,
        deviceInfo: deviceInfo,
        apps: result.installed.map(({ name, version }) => ({ name, version })),
      };

      command("getLatestFirmwareForDevice")(deviceInfo)
        .toPromise()
        .then(latestFirmware => {
          reduxDispatch(setLastSeenDeviceInfo({ lastSeenDevice, latestFirmware }));
        })
        .catch(console.error);
    },
    [sendEvent],
  );

  return (
    <ScreenContainer>
      <ContentContainer style={{ flex: 1 }}>
        <Content>
          {device ? (
            <Success device={device} />
          ) : (
            <DeviceAction
              overridesPreferredDeviceModel={deviceId}
              action={action}
              onResult={onResult}
              request={null}
            />
          )}
        </Content>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={onClickPrev}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.genuineCheck.buttons.prev")}
          </Text>
        </Button>
        <Button id="genuine-check-cta" primary onClick={onClickNext} disabled={!device}>
          <Text ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.genuineCheck.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
