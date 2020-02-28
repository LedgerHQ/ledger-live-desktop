// @flow

import type { Observable } from "rxjs";
import { fromPromise } from "rxjs/observable/fromPromise";
import { withLibcore } from "@ledgerhq/live-common/lib/libcore/access";

type Result = { stringVersion: string, intVersion: number };

const cmd = (): Observable<Result> =>
  fromPromise(
    withLibcore(async ledgerCore => {
      const stringVersion = await ledgerCore.LedgerCore.getStringVersion();
      const intVersion = await ledgerCore.LedgerCore.getIntVersion();
      return { stringVersion, intVersion };
    }),
  );

export default cmd;
