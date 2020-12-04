// @flow
import { from } from "rxjs";
import type { Observable } from "rxjs";
import { checkRPCNodeConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { RPCNodeConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";

const cmd = (config: RPCNodeConfig): Observable<void> => from(checkRPCNodeConfig(config));

export default cmd;
