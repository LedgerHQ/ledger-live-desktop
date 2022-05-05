// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type { ExchangeRaw } from "@ledgerhq/live-common/lib/exchange/platform/types";
import completeExchange from "@ledgerhq/live-common/lib/exchange/platform/completeExchange";
import { fromExchangeRaw } from "@ledgerhq/live-common/lib/exchange/platform/serialization";
import type { TransactionRaw } from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

type Input = {
  deviceId: string,
  provider: string,
  binaryPayload: string,
  signature: string,
  exchange: ExchangeRaw,
  transaction: TransactionRaw,
  exchangeType: number,
};

const cmd = ({
  deviceId,
  provider,
  binaryPayload,
  signature,
  exchange,
  transaction,
  exchangeType,
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
      exchangeType,
    }),
  );
};
export default cmd;
