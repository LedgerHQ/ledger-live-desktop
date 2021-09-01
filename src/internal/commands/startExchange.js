// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import startExchange from "@ledgerhq/live-common/lib/exchange/swap/startExchange";

type Input = {
  deviceId: string,
  transactionType: number,
};

const cmd = ({ deviceId, transactionType }: Input): Observable<any> => {
  return from(
    startExchange({
      deviceId,
      transactionType,
    }),
  );
};
export default cmd;
