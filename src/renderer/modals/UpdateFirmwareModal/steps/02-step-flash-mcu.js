// @flow
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import { command } from "~/renderer/commands";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import FlashMCU from "~/renderer/components/FlashMCU";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Installing from "../Installing";
import type { StepProps } from "../";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";

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
  const [progress, setProgress] = useState(0);

  // didMount
  useEffect(() => {
    setTimeout(() => {
      setInitialDelayPhase(false);
    }, DELAY_PHASE);

    const sub = (getEnv("MOCK")
      ? mockedEventEmitter()
      : command("firmwareMain")(firmware)
    ).subscribe({
      next: ({ progress, installing }) => {
        setProgress(progress);
        setInstalling(installing);
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
      if (sub) {
        sub.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Title id={"firmware-update-flash-mcu-title"}>
        {installing ? "" : t("manager.modal.mcuTitle")}
      </Title>
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
