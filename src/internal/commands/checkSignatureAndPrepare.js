// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type { SellRequestEvent } from "@ledgerhq/live-common/lib/exchange/sell/types";
import type {
  AccountRaw,
  AccountRawLike,
  TransactionStatusRaw,
  TransactionRaw,
} from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import checkSignatureAndPrepare from "@ledgerhq/live-common/lib/exchange/sell/checkSignatureAndPrepare";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import {
  fromAccountRaw,
  fromAccountLikeRaw,
} from "@ledgerhq/live-common/lib/account/serialization";
import { fromTransactionStatusRaw } from "@ledgerhq/live-common/lib/transaction/status";
type Input = {
  parentAccount: ?AccountRaw,
  account: AccountRawLike,
  transaction: TransactionRaw,
  status: TransactionStatusRaw,
  binaryPayload: string,
  payloadSignature: string,
  deviceId: string,
};

const cmd = ({
  deviceId,
  transaction,
  binaryPayload,
  payloadSignature,
  account,
  parentAccount,
  status,
}: Input): Observable<SellRequestEvent> => {
  return withDevice(deviceId)(transport =>
    from(
      checkSignatureAndPrepare(transport, {
        binaryPayload,
        account: fromAccountLikeRaw(account),
        parentAccount: parentAccount ? fromAccountRaw(parentAccount) : undefined,
        status: fromTransactionStatusRaw(status),
        payloadSignature,
        transaction: fromTransactionRaw(transaction),
      }),
    ),
  );
};

export default cmd;
