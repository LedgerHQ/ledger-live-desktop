// @flow

import React, { useEffect } from "react";

const TriggerAppReady = () => {
  useEffect(() => {
    window.api.appLoaded();
  }, []);

  return <div id="__app__ready__" />;
};

export default TriggerAppReady;
