// @flow

import i18next from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheetManager } from "styled-components";
import rtlPlugin from "stylis-plugin-rtl";

const LiveStyleSheetManager = ({ children }: { children: * }) => {
  const [dir, setDir] = useState(i18next.dir());

  const onLanguageChanged = useCallback(lang => {
    setDir(i18next.dir(lang));
  }, []);

  useEffect(() => {
    i18next.on("languageChanged", onLanguageChanged);

    return () => {
      i18next.off("languageChanged", onLanguageChanged);
    };
  }, [onLanguageChanged]);

  return (
    <StyleSheetManager stylisPlugins={dir === "rtl" ? [rtlPlugin] : []} disableVendorPrefixes>
      {children}
    </StyleSheetManager>
  );
};

export default LiveStyleSheetManager;
