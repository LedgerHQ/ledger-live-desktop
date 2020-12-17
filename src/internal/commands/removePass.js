// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import NanoApp from "~/renderer/screens/password/hw-app-nanopass";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  deviceId: string,
  name: string,
};

const cmd = ({ deviceId, name }: Input): Observable<*> => {
  return withDevice(deviceId)(transport => {
    const nanoApp = new NanoApp(transport);
    return from(nanoApp.deleteByName(name));
  });
};

export default cmd;
