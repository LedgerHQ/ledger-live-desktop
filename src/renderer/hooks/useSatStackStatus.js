// @flow
import { useMemo } from "react";
import { useObservable } from "@ledgerhq/live-common/lib/observable";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import { command } from "~/renderer/commands";

let lastState;
const useSatStackStatus = (): ?SatStackStatus => {
  const observable = useMemo(() => command("getSatStackStatus")(), []);
  const value = useObservable(observable, lastState || undefined);
  lastState = value;
  return value;
};

export default useSatStackStatus;
