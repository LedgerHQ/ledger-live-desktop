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
  return from(
    initSwap({
      exchange: fromExchangeRaw(exchange),
      exchangeRate,
      transaction: fromTransactionRaw(transaction),
      deviceId,
    }),
  );
};
export default cmd;
