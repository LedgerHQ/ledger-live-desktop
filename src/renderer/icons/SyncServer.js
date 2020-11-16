// @flow

import React from "react";

const Server = ({ size = 16, color = "current" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <rect
      x="5.84082"
      y="0.75"
      width="4.31818"
      height="4.31818"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="10.9319"
      y="10.9319"
      width="4.31818"
      height="4.31818"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="0.75"
      y="10.9319"
      width="4.31818"
      height="4.31818"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8.00009 5.45459V8.36368H2.90918V10.5455"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M7.99991 5.45459V8.36368H13.0908V10.5455"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

export default Server;
