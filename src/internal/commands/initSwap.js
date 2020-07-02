// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type {
  ExchangeRate,
  ExchangeRaw,
  SwapRequestEvent,
} from "@ledgerhq/live-common/lib/swap/types";
import type { TransactionRaw } from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import { fromExchangeRaw } from "@ledgerhq/live-common/lib/swap/serialization";
import initSwap from "@ledgerhq/live-common/lib/swap/initSwap";

type Input = {
  exchange: ExchangeRaw,
  exchangeRate: ExchangeRate,
  transaction: TransactionRaw,
  deviceId: any,
};

const cmd = ({
  exchange,
  exchangeRate,
  transaction,
  deviceId,
}: Input): Observable<SwapRequestEvent> => {
  const deserializedExchange = fromExchangeRaw(exchange);
  const deserializedTransaction = fromTransactionRaw(transaction);
  return from(initSwap(deserializedExchange, exchangeRate, deserializedTransaction, deviceId));
};
export default cmd;
