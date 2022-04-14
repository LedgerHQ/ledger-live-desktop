import React, { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Bullet, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import DeviceAction from "~/renderer/components/DeviceAction";

import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { command } from "~/renderer/commands";
import { useDispatch, useSelector } from "react-redux";
import { deviceModelIdSelector } from "~/renderer/reducers/onboarding";
import { saveSettings } from "~/renderer/actions/settings";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import { track } from "~/renderer/analytics/segment";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const Success = ({ device }: { device: Device }) => {
  const { t } = useTranslation();
  return (
    <Column>
      <Bullet
        icon="Check"
        text={t("onboarding.screens.tutorial.screens.genuineCheck.success.title")}
        subText={t("onboarding.screens.tutorial.screens.genuineCheck.success.desc", {
          deviceName: t(`devices.${device.modelId}`),
        })}
      />
    </Column>
  );
};

type Props = {
  connectedDevice: unknown;
  setConnectedDevice: (device: unknown) => void;
};

export function GenuineCheck({ connectedDevice, setConnectedDevice }: Props) {
  const dispatch = useDispatch();
  const deviceId = useSelector(deviceModelIdSelector);

  const onResult = useCallback(
    res => {
      setConnectedDevice(res.device);
      dispatch(saveSettings({ hasCompletedOnboarding: true }));
      dispatch(relaunchOnboarding(false));
      track("Onboarding - End");
    },
    [setConnectedDevice, dispatch],
  );

  return connectedDevice ? (
    <Success device={connectedDevice} />
  ) : (
    <DeviceAction
      overridesPreferredDeviceModel={deviceId}
      action={action}
      onResult={onResult}
      request={null}
    />
  );
}

GenuineCheck.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

GenuineCheck.Footer = null;

GenuineCheck.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.genuineCheck.buttons.next" />
);
