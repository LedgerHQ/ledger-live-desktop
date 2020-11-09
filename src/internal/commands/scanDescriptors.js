// @flow
import type { Observable } from "rxjs";
import { from } from "rxjs";
import { scanDescriptors } from "@ledgerhq/live-common/lib/families/bitcoin/descriptor";
import type { AccountDescriptor } from "@ledgerhq/live-common/lib/families/bitcoin/descriptor";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

type Input = {
  deviceId: string,
  currency: CryptoCurrency,
  limit: number,
};

const cmd = ({ deviceId, currency, limit = 10 }: Input): Observable<AccountDescriptor> =>
  from(scanDescriptors(deviceId, currency, limit));

export default cmd;
