// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import manager from "@ledgerhq/live-common/lib/manager";

type Result = ?FirmwareUpdateContext;

const cmd = (deviceInfo: DeviceInfo): Observable<Result> =>
  from(manager.getLatestFirmwareForDevice(deviceInfo));

export default cmd;
