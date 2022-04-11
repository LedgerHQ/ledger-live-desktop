import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Bullet, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import DeviceAction from "~/renderer/components/DeviceAction";

import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { command } from "~/renderer/commands";

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

export type GenuineCheckProps = {
  sendEvent: (event: any) => void;
  context: {
    deviceId: DeviceModelId;
    device?: Device;
  };
};

export function GenuineCheck({ sendEvent }: GenuineCheckProps) {
  // TODO: deviceId in redux state
  const deviceId = "nanoS";
  const device = undefined;

  // const { device } = context;

  const onResult = useCallback(
    res => {
      sendEvent({ type: "GENUINE_CHECK_SUCCESS", device: res.device });
    },
    [sendEvent],
  );

  return device ? (
    <Success device={device} />
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

GenuineCheck.canContinue = context => context.device;

GenuineCheck.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.genuineCheck.buttons.next" />
);
