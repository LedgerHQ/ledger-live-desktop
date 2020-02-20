// @flow

// This is a test example for dev testing purpose.
import { Observable } from "rxjs";

const cmd = (): Observable<"pong"> =>
  Observable.create(o => {
    o.next("pong");
    o.complete();
  });

export default cmd;
