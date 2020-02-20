// @flow

import React from "react";
import png from "./bigspinner.png";

type Props = {
  size?: number,
};

function BigSpinner({ size }: Props) {
  const defaultedSize = size || 44;
  return <img style={{ width: defaultedSize, height: defaultedSize }} src={png} alt="" />;
}

export default BigSpinner;
