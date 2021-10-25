// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import startExchange from "@ledgerhq/live-common/lib/exchange/platform/startExchange";

type Input = {
  deviceId: string,
  exchangeType: number,
};

const cmd = ({ deviceId, exchangeType }: Input): Observable<any> => {
  return from(
    startExchange({
      deviceId,
      exchangeType,
    }),
  );
};
export default cmd;
