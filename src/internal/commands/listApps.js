// @flow
import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { ListAppsEvent } from "@ledgerhq/live-common/lib/apps";

type Input = {
  deviceInfo: DeviceInfo,
  deviceId: string,
};

const cmd = ({ deviceId, deviceInfo }: Input): Observable<ListAppsEvent> =>
  withDevice(deviceId)(transport => listApps(transport, deviceInfo));

export default cmd;
