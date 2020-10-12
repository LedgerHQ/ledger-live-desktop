// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import getTransactionId from "@ledgerhq/live-common/lib/sell/getTransactionId";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  deviceId: string,
};

const cmd = ({ deviceId }: Input): Observable<string> => {
  return withDevice(deviceId)(transport => from(getTransactionId(transport)));
};

export default cmd;
