// @flow
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDevice, removeDevice, resetDevices } from "~/renderer/actions/devices";
import { command } from "~/renderer/commands";
import { getCurrentDevice } from "~/renderer/reducers/devices";

const ListenDevices = () => {
  const device = useSelector(getCurrentDevice);
  const dispatch = useDispatch();
  const lastKnownCookie = useRef(device?.cookie);

  useEffect(() => {
    if (device?.cookie && device?.cookie !== lastKnownCookie) {
      console.log("HACKATHON", "updating cookie");
      lastKnownCookie.current = device.cookie;
    } else {
      console.log("HACKATHON", "keeping last known cookie", lastKnownCookie);
    }
  }, [device]);

  useEffect(() => {
    let sub;
    function syncDevices() {
      const devices = {};
      sub = command("listenDevices")().subscribe(
        ({ device, deviceModel, type, descriptor }) => {
          if (device) {
            const deviceId = descriptor || "";
            const stateDevice = {
              deviceId,
              modelId: deviceModel ? deviceModel.id : "nanoS",
              wired: true,
            };

            if (type === "add") {
              devices[deviceId] = true;
              /**
               * HACKATHON-NOTES
               * Add the cookie information to the connected device, the cookie apdu is only
               * supposed to be available on the dashboard so if we are in an app, don't use it
               */
              command("testApdu")({
                apduHex: "B002000000",
                deviceId: device?.deviceId || "",
              }).subscribe(({ responseHex }) => {
                // if the device is inside an app it returns a 6804 error, which is a bummer
                if (!["6985", "6a15", "6804"].includes(responseHex)) {
                  dispatch(addDevice({ ...stateDevice, cookie: responseHex }));
                } else {
                  console.log(
                    "HACKATHON",
                    "Device not in dashboard, falling back to last known cookie",
                  );
                  dispatch(addDevice({ ...stateDevice, cookie: lastKnownCookie.current }));
                }
              });
            } else if (type === "remove") {
              delete devices[deviceId];
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
