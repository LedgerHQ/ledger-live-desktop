// @flow

import React from "react";

const Shield2 = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg height={size} width={size} viewBox="0 0 22 22">
    <path
      fill="none"
      d="M11 21C21.9741 16.3846 19.9764 4 19.9764 4L11 1L2.02365 4C2.02365 4 0.0260201 16.3846 11 21Z"
      stroke="#6490F1"
      strokeWidth="1.5"
    />
    <path
      fill={color}
      d="M6.90918 10L9.63645 12.7273L15.091 7.27274"
      stroke="#6490F1"
      strokeWidth="1.5"
    />
  </svg>
);

export default Shield2;
