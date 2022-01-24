// @flow

import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDevices, getCurrentDevice } from "~/renderer/reducers/devices";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import IconBluetooth from "~/renderer/icons/Bluetooth";
import IconUSB from "~/renderer/icons/USB";
import Spinner from "~/renderer/components/Spinner";
import { addDevice, resetDevices, setCurrentDevice } from "~/renderer/actions/devices";

const Separator = styled(Box).attrs(() => ({
  mx: 4,
}))`
  height: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

const SelectDevice = ({ onClose }: any) => {
  const dispatch = useDispatch();
  const devices = useSelector(getDevices);
  const currentDevice = useSelector(getCurrentDevice);

  const onSelectDevice = useCallback(
    (device: any) => {
      dispatch(setCurrentDevice(device));
    },
    [dispatch],
  );

  useEffect(() => {
    let sub;
    function syncDevices() {
      const devices = {};
      sub = command("listenDevicesBLE")().subscribe(
        e => {
          const { device, descriptor } = e;
          if (device) {
            const deviceId = device?.id;
            const stateDevice = {
              deviceId: `ble|${deviceId}`,
              modelId: "nanoX",
              wired: false,
              name: device?.name,
            };

            devices[descriptor.address] = true;
            dispatch(addDevice(stateDevice));
          }
        },
        () => {
          resetDevices();
          syncDevices();
        },
        () => {
          resetDevices();
          syncDevices();
        },
      );
    }

    const timeoutSyncDevices = setTimeout(syncDevices, 1000);

    return () => {
      clearTimeout(timeoutSyncDevices);
      sub.unsubscribe();
    };
  }, [dispatch]);

  return (
    <Modal name="MODAL_SELECT_DEVICE" centered onClose={onClose}>
      <ModalBody
        grow
        alignItems="center"
        justifyContent="center"
        mt={3}
        title={"Select a device"}
        render={() => (
          <Box alignItems="center">
            <Text
              ff="Inter|Regular"
              fontSize={4}
              mb={3}
              color="palette.text.shade80"
              textAlign="center"
            >
              {
                "Since we are super awesome now we can detect USB and Bluetooth devices, if you want to pair a new Nano X, make sure it's turned on and in range. If you want to select a USB device plug it in."
              }
            </Text>
            <Separator />
            {devices.map((device, index) => (
              <Box
                horizontal
                key={device?.deviceId || "id"}
                p={2}
                onClick={() => onSelectDevice(device)}
              >
                {device.wired ? <IconUSB size={16} /> : <IconBluetooth size={16} />}
                <Text
                  ml={2}
                  ff={currentDevice?.deviceId === device?.deviceId ? "Inter|Bold" : "Inter|Regular"}
                  fontSize={3}
                  color="palette.text.shade80"
                >
                  {device?.name || device.modelId}
                </Text>
              </Box>
            ))}
            <Spinner size={16} />
          </Box>
        )}
      />
    </Modal>
  );
};

export default SelectDevice;
