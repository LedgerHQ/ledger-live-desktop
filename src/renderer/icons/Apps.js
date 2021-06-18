// @flow

import React from "react";

const Apps = ({ size = 16, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} fill="none">
    <mask id="path-1-inside-1" fill="white">
      <rect x="0.727264" y="0.727295" width="6.54545" height="6.54545" rx="1" />
    </mask>
    <rect
      x="0.727264"
      y="0.727295"
      width="6.54545"
      height="6.54545"
      rx="1"
      stroke={color}
      strokeWidth="3"
      mask="url(#path-1-inside-1)"
    />
    <mask id="path-2-inside-2" fill="white">
      <rect x="0.727264" y="8.72729" width="6.54545" height="6.54545" rx="1" />
    </mask>
    <rect
      x="0.727264"
      y="8.72729"
      width="6.54545"
      height="6.54545"
      rx="1"
      stroke={color}
      strokeWidth="3"
      mask="url(#path-2-inside-2)"
    />
    <mask id="path-3-inside-3" fill="white">
      <rect x="8.72726" y="0.727295" width="6.54545" height="6.54545" rx="1" />
    </mask>
    <rect
      x="8.72726"
      y="0.727295"
      width="6.54545"
      height="6.54545"
      rx="1"
      stroke={color}
      strokeWidth="3"
      mask="url(#path-3-inside-3)"
    />
    <mask id="path-4-inside-4" fill="white">
      <rect x="8.72726" y="8.72729" width="6.54545" height="6.54545" rx="1" />
    </mask>
    <rect
      x="8.72726"
      y="8.72729"
      width="6.54545"
      height="6.54545"
      rx="1"
      stroke={color}
      strokeWidth="3"
      mask="url(#path-4-inside-4)"
    />
  </svg>
);

export default Apps;
