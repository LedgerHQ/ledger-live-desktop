// @flow

import type { Observable } from "rxjs";
import repair from "@ledgerhq/live-common/lib/hw/firmwareUpdate-repair";

type Input = {
  version: ?string,
};

type Result = { progress: number };

// devicePath='' HACK to not depend on a devicePath because it's dynamic
const cmd = ({ version }: Input): Observable<Result> => repair("", version);

export default cmd;
