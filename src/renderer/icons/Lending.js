// @flow
import React from "react";

const LendingIcon = ({ size = 16 }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.54545 7.27274V11.0909C2.54545 12.1955 3.44088 13.0909 4.54545 13.0909H9.45455"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7.27273 10.5455L9.45454 13.0909L7.27273 15.6364"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M13.4545 9.09091V5.27273C13.4545 4.16816 12.5591 3.27273 11.4545 3.27273H6.90909"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9.09091 5.81819L6.90909 3.27274L9.09091 0.727281"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="11.6591"
      y="10.9318"
      width="3.59091"
      height="3.59091"
      rx="1.79545"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="0.75"
      y="1.47726"
      width="3.59091"
      height="3.59091"
      rx="1.79545"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default LendingIcon;
