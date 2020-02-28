// @flow
import type { Observable } from "rxjs";
import { from } from "rxjs";
import flush from "@ledgerhq/live-common/lib/hw/flush";

type Input = string;
type Result = void;

const cmd = (deviceId: Input): Observable<Result> => from(flush(deviceId));

export default cmd;
