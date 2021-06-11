// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import { withLibcore } from "@ledgerhq/live-common/lib/libcore/access";

type Result = { stringVersion: string, intVersion: number };

const cmd = (): Observable<Result> =>
  from(
    withLibcore(async ledgerCore => {
      const stringVersion = await ledgerCore.LedgerCore.getStringVersion();
      const intVersion = await ledgerCore.LedgerCore.getIntVersion();
      return { stringVersion, intVersion };
    }),
  );

export default cmd;
