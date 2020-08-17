// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addDevice, removeDevice, resetDevices } from "~/renderer/actions/devices";
import { command } from "~/renderer/commands";

const ListenDevices = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let sub;
    function syncDevices() {
      const devices = {};
      sub = command("listenDevices")().subscribe(
        ({ device, deviceModel, type }) => {
          if (device) {
            const stateDevice = {
              deviceId: device.path,
              modelId: deviceModel ? deviceModel.id : "nanoS",
              wired: true,
            };

            if (type === "add") {
              devices[device.path] = true;
              dispatch(addDevice(stateDevice));
            } else if (type === "remove") {
              delete device[device.path];
              dispatch(removeDevice(stateDevice));
            }
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

  return null;
};

export default ListenDevices;
