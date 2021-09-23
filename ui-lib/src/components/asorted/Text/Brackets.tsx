import React from "react";

export const BracketRight = (props: any) => (
  <svg viewBox="0 0 64 128" fill="currentColor" {...props}>
    <g>
      <path d="m 8.692,119.94 v 8.058 H 64 V 91.6548 H 55.941 V 119.94 Z" />
      <path d="M 8.692,0 V 8.05844 H 55.941 V 36.3452 H 64 V 0 Z" />
    </g>
  </svg>
);

export const BracketLeft = (props: any) => (
  <svg viewBox="0 0 64 128" fill="currentColor" {...props}>
    <g>
      <path d="M 0,91.6548 V 128 h 55.3076 v -8.06 H 8.05844 V 91.6548 Z" />
      <path d="M 0,0 V 36.3452 H 8.05844 V 8.05844 H 55.3076 V 0 Z" />
    </g>
  </svg>
);
