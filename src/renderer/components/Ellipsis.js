// @flow

import React from "react";
import Text from "~/renderer/components/Text";

const innerStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
  display: "block" /** important for ellipsis to work */,
};

const Ellipsis = ({ children, canSelect, ...p }: { children: any, canSelect?: boolean }) => (
  <Text {...p} style={{ ...innerStyle, userSelect: canSelect ? "text" : "none" }}>
    {children}
  </Text>
);

export default Ellipsis;
