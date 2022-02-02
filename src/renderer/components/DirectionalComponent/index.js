// @flow

import i18next from "i18next";
import React from "react";

interface DirectionalComponentProps {
  ltr: React.ComponentType;
  rtl: React.ComponentType;
}

const DirectionalComponent = ({
  ltr: LtrComponent,
  rtl: RtlComponent,
  ...props
}: DirectionalComponentProps) => {
  const dir = i18next.dir();

  return <>{dir === "ltr" ? <LtrComponent {...props} /> : <RtlComponent {...props} />}</>;
};

export default DirectionalComponent;
