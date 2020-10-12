// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type { SwapRequestEvent } from "@ledgerhq/live-common/lib/swap/types";
import type { TransactionRaw } from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import checkSignatureAndPrepare from "@ledgerhq/live-common/lib/sell/checkSignatureAndPrepare";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import { fromAccountRaw } from "@ledgerhq/live-common/lib/account/serialization";
import { fromTransactionStatusRaw } from "@ledgerhq/live-common/lib/transaction/status";

type Input = {
  transaction: TransactionRaw,
  deviceId: string,
};

const cmd = ({
  deviceId,
  transaction,
  binaryPayload,
  receiver,
  payloadSignature,
  account,
  status,
}: Input): Observable<string> => {
  return withDevice(deviceId)(transport =>
    from(
      checkSignatureAndPrepare(transport, {
        transaction: fromTransactionRaw(transaction),
        binaryPayload,
        receiver,
        payloadSignature,
        account: fromAccountRaw(account),
        status: fromTransactionStatusRaw(status),
      }),
    ),
  );
};

export default cmd;
