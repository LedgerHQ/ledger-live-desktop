// @flow
import React, { useEffect } from "react";
import { timeout } from "rxjs/operators";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import { command } from "~/renderer/commands";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "../";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { renderFirmwareUpdating } from "~/renderer/components/DeviceAction/rendering";
import useTheme from "~/renderer/hooks/useTheme";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
}))``;

type BodyProps = {
  modelId: DeviceModelId,
};

export const Body = ({ modelId }: BodyProps) => {
  const type = useTheme("colors.palette.type");
  return renderFirmwareUpdating({ modelId, type });
};

type Props = StepProps;

const StepUpdating = ({ firmware, deviceModelId, setError, transitionTo }: Props) => {
  useEffect(() => {
    const sub = (getEnv("MOCK")
      ? mockedEventEmitter()
      : command("firmwareUpdating")({ deviceId: "" })
    )
      .pipe(timeout(5 * 60 * 1000))
      .subscribe({
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
  }, [setError, transitionTo]);

  return (
    <Container>
      <TrackPage category="Manager" name="Firmware Updating" />
      <Body modelId={deviceModelId} />
    </Container>
  );
};

export default StepUpdating;
