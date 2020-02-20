// @flow
import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { ListAppsEvent } from "@ledgerhq/live-common/lib/apps";

type Input = {
  deviceInfo: DeviceInfo,
  devicePath: string,
};

const cmd = ({ devicePath, deviceInfo }: Input): Observable<ListAppsEvent> =>
  withDevice(devicePath)(transport => listApps(transport, deviceInfo));

export default cmd;
