// @flow
import { useState, useEffect } from "react";
import semver from "semver";
import manager from "@ledgerhq/live-common/lib/manager";
import ManagerAPI from "@ledgerhq/live-common/lib/api/Manager";
import type { DeviceModelInfo } from "~/renderer/reducers/settings";

// TODO: Probably move this to live-common
async function hasOudatedApps({ deviceInfo, modelId, apps }: DeviceModelInfo): Promise<boolean> {
  const deviceVersion = await ManagerAPI.getDeviceVersion(
    deviceInfo.targetId,
    deviceInfo.providerId,
  );
  const firmware = await ManagerAPI.getCurrentFirmware({
    deviceId: deviceVersion.id,
    version: deviceInfo.version,
    provider: deviceInfo.providerId,
  });

  const compatibleAppVersionsList = await ManagerAPI.applicationsByDevice({
    provider: deviceInfo.providerId,
    current_se_firmware_final_version: firmware.id,
    device_version: deviceVersion.id,
  });

  const outdated = apps.map(app => {
    const currApp = compatibleAppVersionsList.find(e => e.name === app.name);
    return currApp && semver.gt(currApp.version, app.version);
  });

  return outdated.some(Boolean);
}

function useShouldDisplayBlueDot(dmi: ?DeviceModelInfo): boolean {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    let cancelled = false;
    function cancel() {
      cancelled = true;
    }

    if (!dmi) {
      setDisplay(true);
      return cancel;
    }

    const { deviceInfo, modelId, apps } = dmi;

    if (!deviceInfo || !modelId) {
      setDisplay(true);
      return cancel;
    }

    Promise.all([
      manager.getLatestFirmwareForDevice(deviceInfo),
      hasOudatedApps({ deviceInfo, modelId, apps }),
    ])
      .then(([fw, outdatedApp]) => {
        if (cancelled) return;

        if (fw || outdatedApp) {
          setDisplay(true);
          return;
        }

        setDisplay(false);
      })
      .catch(err => {
        console.log(err);
        setDisplay(false);
      });

    return cancel;
  }, [dmi]);

  return display;
}

export default useShouldDisplayBlueDot;
