// @flow
import React, { useState, useEffect, useCallback } from "react";
import { command } from "~/renderer/commands";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setLastSeenDeviceInfo } from "~/renderer/actions/settings";
import { lastSeenDeviceSelector } from "~/renderer/reducers/settings";

import { getCurrentDevice } from "~/renderer/reducers/devices";

const Wrapper = styled.pre`
  position: absolute;
  bottom: 0;
  color: white;
  font-size: 10px;
`;

const SyncOnboardingController = ({ state, sendEvent }: any) => {
  const dispatch = useDispatch();
  const [logs, setLogs] = useState([]);

  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const {
    deviceInfo: { onboarding },
  } = lastSeenDevice || { deviceInfo: {} };
  const device = useSelector(getCurrentDevice);

  useEffect(() => {
    // Reset
    dispatch(
      setLastSeenDeviceInfo({
        lastSeenDevice: {
          modelId: device?.modelId,
          deviceInfo: {},
        },
        latestFirmware: null,
      }),
    );
  }, [device?.modelId, dispatch]);

  useEffect(() => {
    if (!device) return;
    if (state.value === "selectDevice" && device?.modelId) {
      setLogs(l => [...l, `Selecting device ${device.modelId}`]);
      sendEvent({ type: "DEVICE_SELECTED", deviceId: device.modelId });
    }
    if (!onboarding) return;

    const { isOnboarded, isSeedRecovery } = onboarding;

    if (state.value === "selectUseCase") {
      if (!isOnboarded) {
        if (isSeedRecovery) {
          setLogs(l => [...l, "Start recover seed flow"]);
          sendEvent("USE_RECOVERY_PHRASE");
        }
      } else {
        setLogs(l => [...l, "Device is seeded, skip onboarding"]);
        // sendEvent("FINISH");
      }
    }
  }, [state, device, sendEvent, onboarding]);

  const pong = useCallback(callback => {
    if (!callback) return;
    setTimeout(callback, 2000);
  }, []);

  const ping = useCallback(() => {
    command("firmwareUpdating")({ deviceId: "" }).subscribe({
      next: lastSeenDevice => {
        dispatch(
          setLastSeenDeviceInfo({
            lastSeenDevice: {
              modelId: device?.modelId,
              deviceInfo: lastSeenDevice,
            },
            latestFirmware: null,
          }),
        );
        pong(ping);
      },
      error: () => {
        dispatch(setLastSeenDeviceInfo({ lastSeenDevice: null, latestFirmware: null }));
        pong(ping);
      },
    });
  }, [device?.modelId, dispatch, pong]);

  useEffect(() => ping(), [ping]);
  return <Wrapper>{JSON.stringify([logs, state.value, onboarding, device], null, 2)}</Wrapper>;
};

export default SyncOnboardingController;
