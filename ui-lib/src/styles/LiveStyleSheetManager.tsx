import React from "react";
import { StyleSheetManager } from "styled-components";

const LiveStyleSheetManager = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <StyleSheetManager disableVendorPrefixes>{children}</StyleSheetManager>
);

export default LiveStyleSheetManager;
