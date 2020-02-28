// @flow

// This is a test example for dev testing purpose.
import type { Observable } from "rxjs";
import { from } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  devicePath: string,
  apduHex: string,
};
type Result = {
  responseHex: string,
};

const cmd = ({ apduHex, devicePath }: Input): Observable<Result> =>
  withDevice(devicePath)(transport =>
    from(
      transport
        .exchange(Buffer.from(apduHex, "hex"))
        .then(res => ({ responseHex: res.toString("hex") })),
    ),
  );

export default cmd;
