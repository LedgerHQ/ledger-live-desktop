// @flow

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { Device } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import Interactions from "~/renderer/icons/device/interactions";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import type { StepProps } from "../";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
  px: 7,
}))``;

const Title = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 5,
  mb: 3,
}))``;

const Address = styled(Box).attrs(p => ({
  bg: p.notValid
    ? "transparent"
    : p.withQRCode
    ? "palette.background.paper"
    : "palette.background.default",
  borderRadius: 1,
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
  fontSize: 4,
  mt: 2,
  px: p.notValid ? 0 : 4,
  py: p.notValid ? 0 : 3,
}))`
  border: ${p => (p.notValid ? "none" : `1px dashed ${p.theme.colors.palette.divider}`)};
  cursor: text;
  user-select: text;
  width: 325px;
  text-align: center;
`;

const Body = ({
  displayedOnDevice,
  progress,
  deviceModelId,
  firmware,
}: {
  displayedOnDevice: boolean,
  progress: number,
  deviceModelId: DeviceModelId,
  firmware: FirmwareUpdateContext,
}) => {
  const { t } = useTranslation();

  const isBlue = deviceModelId === "blue";

  const formatHashName = (hash: string): string => {
    if (!hash) {
      return "";
    }

    const upper = hash.toUpperCase();
    return upper.length > 8 ? `${upper.slice(0, 4)}...${upper.substr(-4)}` : upper;
  };

  if (!displayedOnDevice) {
    return (
      <>
        <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
          {t("manager.firmware.downloadingUpdateDesc")}
        </Text>
        <Box my={5}>
          <ProgressCircle progress={progress} size={56} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
        {t("manager.modal.confirmIdentifierText")}
      </Text>
      <Box mx={7} mt={5} mb={isBlue ? 0 : 5}>
        <Text ff="Inter|SemiBold" textAlign="center" color="palette.text.shade80">
          {t("manager.modal.identifier")}
        </Text>
        <Address>{firmware.osu && formatHashName(firmware.osu.hash)}</Address>
      </Box>
      <Box mt={isBlue ? 4 : null}>
        <Interactions
          wire="wired"
          type={deviceModelId}
          width={isBlue ? 150 : 375}
          screen="validation"
          action="accept"
        />
      </Box>
    </>
  );
};

type Props = StepProps & {
  device: Device,
  deviceModelId: DeviceModelId,
};

const StepFullFirmwareInstall = ({ firmware, deviceModelId, transitionTo, setError }: Props) => {
  const { t } = useTranslation();
  const device = useSelector(getCurrentDevice);
  const [progress, setProgress] = useState(0);
  const [displayedOnDevice, setDisplayedOnDevice] = useState(false);

  // didMount effect
  useEffect(() => {
    if (!firmware.osu) {
      transitionTo("finish");
      return;
    }

    const sub = (getEnv("MOCK")
      ? mockedEventEmitter()
      : command("firmwarePrepare")({
          devicePath: device ? device.path : "",
          firmware,
        })
    ).subscribe({
      next: ({ progress, displayedOnDevice: displayed }) => {
        setProgress(progress);
        setDisplayedOnDevice(displayed);
      },
      complete: () => {
        transitionTo("updateMCU");
      },
      error: error => {
        setError(error);
        transitionTo("finish");
      },
    });

    return () => {
      if (sub) sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Title>
        {!displayedOnDevice
          ? t("manager.modal.steps.downloadingUpdate")
          : t("manager.modal.confirmIdentifier")}
      </Title>
      <TrackPage category="Manager" name="InstallFirmware" />
      <Body
        deviceModelId={deviceModelId}
        displayedOnDevice={displayedOnDevice}
        firmware={firmware}
        progress={progress}
      />
    </Container>
  );
};

export default StepFullFirmwareInstall;
