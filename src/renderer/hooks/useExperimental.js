// @flow
import { useEffect, useState } from "react";
import { changes } from "@ledgerhq/live-common/lib/env";

import { enabledExperimentalFeatures } from "./../experimental";

const useExperimental = (): boolean => {
  const [state, setState] = useState(() => enabledExperimentalFeatures().length > 0);

  useEffect(() => {
    const sub = changes.subscribe(() => {
      const newExperimental = enabledExperimentalFeatures().length > 0;
      setState(newExperimental);
    });

    return () => sub.unsubscribe();
  }, []);

  return state;
};

export default useExperimental;
