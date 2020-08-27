// @flow

import React from "react";

const AngleDown = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size * 0.875}>
    <path
      fill={color}
      d="M7.71875 10.875C7.875 11.0312 8.09375 11.0312 8.25 10.875L12.875 6.28125C13.0312 6.15625 13.0312 5.90625 12.875 5.75L12.25 5.15625C12.125 5 11.875 5 11.7188 5.15625L8 8.84375L4.25 5.15625C4.09375 5 3.875 5 3.71875 5.15625L3.09375 5.75C2.9375 5.90625 2.9375 6.15625 3.09375 6.28125L7.71875 10.875Z"
    />
  </svg>
);

export default AngleDown;
