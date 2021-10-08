// @flow
import React from "react";

const SwapCircle = ({ size = 15, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="35" cy="35" r="35" fill={color} fillOpacity="0.1" />
    <path
      d="M49.136 36.3636V40.4546C49.136 42.1114 47.7929 43.4546 46.136 43.4546H21.8633M21.8633 43.4546L27.3178 48.9091M21.8633 43.4546L27.3178 38M21.8633 33.6364V29.4091C21.8633 27.7523 23.2065 26.4091 24.8633 26.4091H49.136M49.136 26.4091L43.6815 20.9546M49.136 26.4091L43.6815 31.8637"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

export default SwapCircle;
