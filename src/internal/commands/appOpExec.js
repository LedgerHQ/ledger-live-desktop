// @flow
import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import { execWithTransport } from "@ledgerhq/live-common/lib/apps/hw";
import type { AppOp } from "@ledgerhq/live-common/lib/apps";

type Input = {
  devicePath: string,
  appOp: AppOp,
  targetId: string | number,
  app: App,
};

type Result = {
  progress: number,
};

const cmd = ({ devicePath, appOp, targetId, app }: Input): Observable<Result> =>
  withDevice(devicePath)(transport => execWithTransport(transport)(appOp, targetId, app));

export default cmd;
