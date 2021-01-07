// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import type { Input, ConnectAppEvent } from "@ledgerhq/live-common/lib/hw/connectApp";
const cmd = (input: Input): Observable<ConnectAppEvent> => from(connectApp(input));

export default cmd;
