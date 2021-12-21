// @flow
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import { hasFinalFirmware } from "@ledgerhq/live-common/lib/hw/hasFinalFirmware";
import { command } from "~/renderer/commands";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import FlashMCU from "~/renderer/components/FlashMCU";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Installing from "../Installing";
import type { StepProps } from "../";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { Body as StepUpdatingBody } from "./02-step-updating";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
}))``;

const Title = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 5,
  mb: 3,
}))``;

type BodyProps = {
  installing: ?string,
  progress: number,
  deviceModelId: DeviceModelId,
  firmware: FirmwareUpdateContext,
  initialDelayPhase: boolean,
};

const Body = ({ installing, progress, firmware, deviceModelId, initialDelayPhase }: BodyProps) => {
  return installing || !firmware.shouldFlashMCU || initialDelayPhase ? (
    <Installing installing={installing} progress={progress} />
  ) : (
    <FlashMCU deviceModelId={deviceModelId} />
  );
};

type MaybeString = ?string;
type Props = StepProps;

const DELAY_PHASE = 10000;

const StepFlashMcu = ({ firmware, deviceModelId, setError, transitionTo }: Props) => {
  const { t } = useTranslation();
  const [installing, setInstalling] = useState<MaybeString>(null);
  const [initialDelayPhase, setInitialDelayPhase] = useState(true);
  // when autoUpdatingMode is true, we simply display the same content as in "step-updating" as the device turns into auto update mode
  const [autoUpdatingMode, setAutoUpdatingMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const withFinal = useMemo(() => hasFinalFirmware(firmware?.final), [firmware]);

  // didMount
  useEffect(() => {
    setTimeout(() => {
      setInitialDelayPhase(false);
    }, DELAY_PHASE);
    let endOfFirstFlashMcuTimeout;

    const sub = (getEnv("MOCK")
      ? mockedEventEmitter()
      : command("firmwareMain")(firmware)
    ).subscribe({
      next: ({ progress, installing }) => {
        setProgress(progress);
        setInstalling(installing);
        if (!withFinal && installing === "flash-mcu" && progress === 1) {
          // set a flag to display the "updating" mode
          // timeout will debounces the UI to not see the "loading" if there are possible second mcu in future
          endOfFirstFlashMcuTimeout = setTimeout(() => setAutoUpdatingMode(true), 1000);
        } else {
          if (endOfFirstFlashMcuTimeout) {
            clearTimeout(endOfFirstFlashMcuTimeout);
            endOfFirstFlashMcuTimeout = null;
          }
        }
      },
      complete: () => {
        transitionTo("finish");
      },
      error: error => {
        setError(error);
        transitionTo("finish");
      },
    });

    return () => {
      if (endOfFirstFlashMcuTimeout) {
        clearTimeout(endOfFirstFlashMcuTimeout);
      }
      if (sub) {
        sub.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (autoUpdatingMode) {
    return (
      <Container>
        <TrackPage category="Manager" name="Firmware Updating" />
        <StepUpdatingBody modelId={deviceModelId} />
      </Container>
    );
  }

  return (
    <Container data-test-id="firmware-update-flash-mcu-progress">
      <Title>{installing ? "" : t("manager.modal.mcuTitle")}</Title>
      <TrackPage category="Manager" name="FlashMCU" />
      <Body
        deviceModelId={deviceModelId}
        firmware={firmware}
        installing={installing}
        progress={progress}
        initialDelayPhase={initialDelayPhase}
      />
    </Container>
  );
};

export default StepFlashMcu;
