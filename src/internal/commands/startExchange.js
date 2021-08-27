// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import startExchange from "@ledgerhq/live-common/lib/exchange/swap/startExchange";

type Input = {
  deviceId: string,
};

const cmd = ({ deviceId }: Input): Observable<any> => {
  return from(
    startExchange({
      deviceId,
    }),
  );
};
export default cmd;
