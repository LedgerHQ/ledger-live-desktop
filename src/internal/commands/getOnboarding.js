// @flow
import type { Observable } from "rxjs";
import { from } from "rxjs";
import onboarding from "@ledgerhq/live-common/lib/hw/onboarding";

type Input = string;
type Result = void;

const cmd = (deviceId: Input): Observable<Result> => from(onboarding(deviceId));

export default cmd;
