// @flow
import type { SatsStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import { statusObservable } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { Observable } from "rxjs";

const cmd = (): Observable<SatsStackStatus> => statusObservable;

export default cmd;
