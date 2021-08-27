// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type { ExchangeRaw } from "@ledgerhq/live-common/lib/exchange/swap/types";
import completeExchange from "@ledgerhq/live-common/lib/exchange/swap/completeExchange";
import { fromExchangeRaw } from "@ledgerhq/live-common/lib/exchange/swap/serialization";
import type { TransactionRaw } from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

type Input = {
  deviceId: string,
  provider: string,
  binaryPayload: string,
  signature: string,
  exchange: ExchangeRaw,
  transaction: TransactionRaw,
};

const cmd = ({
  deviceId,
  provider,
  binaryPayload,
  signature,
  exchange,
  transaction,
}: Input): Observable<any> => {
  // TODO type the events?
  return from(
    completeExchange({
      deviceId,
      provider,
      binaryPayload,
      signature,
      exchange: fromExchangeRaw(exchange),
      transaction: fromTransactionRaw(transaction),
    }),
  );
};
export default cmd;
