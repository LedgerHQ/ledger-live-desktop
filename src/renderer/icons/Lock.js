// @flow

import React from "react";

const Lock = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path
      fill={color}
      d="M15 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5v-7A1.5 1.5 0 0 1 2.5 6h1V4.5A4.506 4.506 0 0 1 8.012 0C10.5.006 12.5 2.056 12.5 4.544V6h1A1.5 1.5 0 0 1 15 7.5zM5 6h6V4.5c0-1.653-1.347-3-3-3s-3 1.347-3 3V6zm8.5 1.5h-11v7h11v-7z"
    />
  </svg>
);

export default Lock;
