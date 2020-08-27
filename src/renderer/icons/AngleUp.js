// @flow

import React from "react";

const AngleUp = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size * 0.875}>
    <path
      fill={color}
      d="M8.25 5.15625C8.09375 5 7.875 5 7.71875 5.15625L3.09375 9.71875C2.9375 9.875 2.9375 10.125 3.09375 10.25L3.71875 10.875C3.875 11.0312 4.09375 11.0312 4.25 10.875L8 7.1875L11.7188 10.875C11.875 11.0312 12.125 11.0312 12.25 10.875L12.875 10.25C13.0312 10.125 13.0312 9.875 12.875 9.71875L8.25 5.15625Z"
    />
  </svg>
);

export default AngleUp;
