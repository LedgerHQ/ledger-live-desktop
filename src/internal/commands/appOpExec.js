// @flow
import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import { execWithTransport } from "@ledgerhq/live-common/lib/apps/hw";
import type { AppOp } from "@ledgerhq/live-common/lib/apps";

type Input = {
  deviceId: string,
  appOp: AppOp,
  targetId: string | number,
  app: App,
};

type Result = {
  progress: number,
};

const cmd = ({ deviceId, appOp, targetId, app }: Input): Observable<Result> =>
  withDevice(deviceId)(transport => execWithTransport(transport)(appOp, targetId, app));

export default cmd;
