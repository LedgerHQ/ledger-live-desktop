// @flow

// This is a test example for dev testing purpose.

import type { Observable } from "rxjs";
import { interval } from "rxjs";

const cmd: () => Observable<*> = interval;

export default cmd;
