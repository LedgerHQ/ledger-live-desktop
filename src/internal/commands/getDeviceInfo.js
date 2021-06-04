// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";

type Input = {
  deviceId: string,
};

type Result = DeviceInfo;

const cmd = ({ deviceId }: Input): Observable<Result> =>
  withDevice(deviceId)(transport => from(getDeviceInfo(transport)));

export default cmd;
