// @flow

// This is a test example for dev testing purpose.
import type { Observable } from "rxjs";

const cmd = (): Observable<void> => {
  // $FlowFixMe
  crashTest(); // eslint-disable-line
  throw new Error();
};

export default cmd;
