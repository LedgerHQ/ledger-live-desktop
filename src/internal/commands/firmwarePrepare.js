// @flow

import type { Observable } from "rxjs";
import prepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import type { FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";

type Input = {
  devicePath: string,
  firmware: FirmwareUpdateContext,
};

type Result = { progress: number, displayedOnDevice: boolean };

const cmd = ({ devicePath, firmware }: Input): Observable<Result> => prepare(devicePath, firmware);

export default cmd;
