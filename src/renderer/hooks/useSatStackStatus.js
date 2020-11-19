// @flow
import { useMemo } from "react";
import { useObservable } from "@ledgerhq/live-common/lib/observable";
import { command } from "~/renderer/commands";

const useSatStackStatus = () => {
  const observable = useMemo(() => command("getSatStackStatus")(), []);
  return useObservable(observable);
};

export default useSatStackStatus;
