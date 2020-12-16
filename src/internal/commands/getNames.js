// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import NanoApp from "~/renderer/screens/password/hw-app-nanopass";
import type { SellRequestEvent } from "@ledgerhq/live-common/lib/exchange/sell/types";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  deviceId: string,
};

const cmd = ({ deviceId }: Input): Observable<SellRequestEvent> => {
  return withDevice(deviceId)(transport => {
    const nanoApp = new NanoApp(transport);
    return from(nanoApp.getNames());
  });
};

export default cmd;
