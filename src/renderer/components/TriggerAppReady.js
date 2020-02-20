// @flow

import { useEffect } from "react";

const TriggerAppReady = () => {
  useEffect(() => {
    window.api.appLoaded();
  }, []);

  return null;
};

export default TriggerAppReady;
