// @flow
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import { command } from "~/renderer/commands";
import DeviceAction from "~/renderer/components/DeviceAction";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import InfoDisplay from "~/renderer/components/InfoDisplay";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { getCurrentDevice } from "~/renderer/reducers/devices";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const Container = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: center;
  min-height: 220px;
`;

const Connected = ({
  origin,
  onComplete,
  onError,
}: {
  origin: ?string,
  onComplete: () => void,
  onError: Error => void,
}) => {
  const device = useSelector(getCurrentDevice);

  useEffect(() => {
    if (!device) return;
    const { deviceId } = device;
    const sub = command("websocketBridge")({ deviceId, origin }).subscribe({
      complete: onComplete,
      error: onError,
    });
    return () => {
      sub.unsubscribe();
    };
  }, [origin, device, onError, onComplete]);

  return null;
};

const Bridge = ({
  origin,
  appName,
  onClose,
}: {
  origin: ?string,
  appName: ?string,
  onClose: () => void,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState({ status: "intro" });

  const onResult = useCallback(
    result => {
      setState({ status: "init", result });
    },
    [setState],
  );

  const onError = useCallback(
    error => {
      setState({ status: "error", error });
    },
    [setState],
  );

  const onComplete = useCallback(() => {
    setState({ status: "done" });
  }, [setState]);

  return (
    <ModalBody
      onClose={!["init", "device"].includes(state.status) ? onClose : undefined}
      title={t("bridge.modalTitle")}
      render={() => (
        <Box relative px={5}>
          <TrackPage category="Modal" name="Bridge" origin={origin} />

          {state.status === "intro" ? (
            <Container>
              <InfoDisplay
                title={t("bridge.openHeader")}
                description={t("bridge.openDescription")}
              />
            </Container>
          ) : state.status === "device" ? (
            <DeviceAction
              action={action}
              request={{ appName: appName || "Ethereum" }}
              onResult={onResult}
            />
          ) : state.status === "init" ? (
            <>
              <Container>
                <SuccessDisplay
                  title={t("bridge.openedHeader", { appName })}
                  description={t("bridge.openedDescription", { appName })}
                />
              </Container>
              <Connected origin={origin} onError={onError} onComplete={onComplete} />
            </>
          ) : state.status === "error" ? (
            <Container>
              <ErrorDisplay error={state.error} />
            </Container>
          ) : (
            <Container>
              <SuccessDisplay
                title={t("bridge.completeHeader", { appName })}
                description={t("bridge.completeDescription", { appName })}
              />
            </Container>
          )}
        </Box>
      )}
      renderFooter={() =>
        ["intro", "init"].includes(state.status) ? (
          <Box horizontal justifyContent="flex-end">
            <Button
              onClick={() => {
                if (state.status === "intro") {
                  setState({ status: "device" });
                }
                if (state.status === "init") {
                  onComplete();
                }
              }}
              primary
            >
              {state.status === "intro" ? t("bridge.openButton") : t("bridge.disconnectButton")}
            </Button>
          </Box>
        ) : null
      }
    />
  );
};

export default Bridge;
