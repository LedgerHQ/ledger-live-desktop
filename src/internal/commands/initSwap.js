// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type {
  ExchangeRate,
  ExchangeRaw,
  SwapRequestEvent,
} from "@ledgerhq/live-common/lib/swap/types";
import { fromExchangeRaw } from "@ledgerhq/live-common/lib/swap/serialization";
import initSwap from "@ledgerhq/live-common/lib/swap/initSwap";

type Input = {
  exchange: ExchangeRaw,
  exchangeRate: ExchangeRate,
  deviceId: any,
};

const cmd = ({ exchange, exchangeRate, deviceId }: Input): Observable<SwapRequestEvent> => {
  const deserializedExchange = fromExchangeRaw(exchange);
  return from(initSwap(deserializedExchange, exchangeRate, deviceId));
};
export default cmd;
