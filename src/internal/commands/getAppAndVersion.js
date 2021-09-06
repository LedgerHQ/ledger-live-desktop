// @flow
import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";
import { from } from "rxjs";

type Input = {
  deviceId: string,
};

const cmd = ({
  deviceId,
}: Input): Observable<{
  name: string,
  version: string,
  flags: number | Buffer,
}> => withDevice(deviceId)(transport => from(getAppAndVersion(transport)));

export default cmd;
