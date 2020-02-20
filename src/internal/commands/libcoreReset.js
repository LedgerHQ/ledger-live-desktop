// @flow
import type { Observable } from "rxjs";
import { from } from "rxjs";
import { reset } from "@ledgerhq/live-common/lib/libcore/access";

const cmd = (): Observable<void> => from(reset());

export default cmd;
