// @flow

import React, { useCallback, useState, useEffect } from "react";
import { reduce } from "rxjs/operators";
import TrackPage from "~/renderer/analytics/TrackPage";
import DeviceAction from "~/renderer/components/DeviceAction";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import { shell } from "electron";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import BigSpinner from "~/renderer/components/BigSpinner";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import type { FullNodeSteps, ConnectionStatus } from "~/renderer/modals/FullNode";
import { CheckWrapper, connectionStatus } from "~/renderer/modals/FullNode";
import IconCheck from "~/renderer/icons/Check";

const connectAppExec = command("connectApp");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const StepConnectDevice = ({
  onStepChange,
  setScannedDescriptors,
  setError,
}: {
  onStepChange: FullNodeSteps => void,
  setScannedDescriptors: any => void,
  setError: Error => void,
}) => {
  const currency = getCryptoCurrencyById("bitcoin");
  const [device, setDevice] = useState(null);
  const [scanStatus, setScanStatus] = useState<ConnectionStatus>(connectionStatus.IDLE);

  useEffect(() => {
    if (device) {
      const currency = getCryptoCurrencyById("bitcoin");
      command("scanDescriptors")({
        deviceId: device.deviceId,
        currency,
        limit: 10,
      })
        // $FlowFixMe I don't know what you want.
        .pipe(reduce((acc, item) => acc.concat({ descriptor: item }), []))
        .subscribe(descriptors => {
          setScanStatus(connectionStatus.SUCCESS);
          setScannedDescriptors(descriptors);
        });
    }
  }, [device, setScannedDescriptors]);

  return (
    <>
      <TrackPage category="FullNode" name="Step3" currencyName={currency.name} />
      {scanStatus === connectionStatus.IDLE ? (
        <DeviceAction
          action={action}
          request={{ currency }}
          onResult={({ device }) => {
            setDevice(device);
            setScanStatus(connectionStatus.PENDING);
          }}
        />
      ) : scanStatus === connectionStatus.SUCCESS ? (
        <Box alignItems="center">
          <CheckWrapper size={50}>
            <IconCheck size={20} />
          </CheckWrapper>
          <Text
            ff="Inter|SemiBold"
            textAlign={"center"}
            mt={32}
            fontSize={6}
            color="palette.text.shade100"
          >
            <Trans i18nKey="fullNode.modal.steps.device.connectionSteps.success.header" />
          </Text>
          <Text
            ff="Inter|Regular"
            mt={2}
            textAlign={"center"}
            fontSize={3}
            color="palette.text.shade50"
          >
            <Trans i18nKey="fullNode.modal.steps.device.connectionSteps.success.description" />
          </Text>
        </Box>
      ) : (
        <Box alignItems="center">
          <BigSpinner size={50} />
          <Text
            ff="Inter|SemiBold"
            textAlign={"center"}
            mt={32}
            fontSize={6}
            color="palette.text.shade100"
          >
            <Trans i18nKey="fullNode.modal.steps.device.connectionSteps.pending.header" />
          </Text>
          <Text
            ff="Inter|Regular"
            mt={2}
            textAlign={"center"}
            fontSize={3}
            color="palette.text.shade50"
          >
            <Trans i18nKey="fullNode.modal.steps.device.connectionSteps.pending.description" />
          </Text>
        </Box>
      )}
    </>
  );
};

export const StepDeviceFooter = ({
  onClose,
  onStepChange,
  scannedDescriptors,
}: {
  onClose: () => void,
  onStepChange: FullNodeSteps => void,
  scannedDescriptors: any,
}) => {
  const onOpenUserDataFolder = useCallback(() => {
    const userDataDirectory = resolveUserDataDirectory();
    shell.showItemInFolder(userDataDirectory);
  }, []);

  return (
    <Box horizontal alignItems={"flex-end"}>
      {scannedDescriptors ? (
        <Button onClick={onOpenUserDataFolder} mr={3}>
          <Trans i18nKey="fullNode.modal.steps.device.connectionSteps.success.cta" />
        </Button>
      ) : (
        <Button onClick={onClose} mr={3}>
          <Trans i18nKey="common.cancel" />
        </Button>
      )}
      <Button primary onClick={() => onStepChange("satstack")} disabled={!scannedDescriptors}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
};

export default StepConnectDevice;
