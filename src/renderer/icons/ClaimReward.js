// @flow

import React from "react";

const ClaimRewards = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <g>
      <rect
        x="0.75"
        y="11.6593"
        width="14.5"
        height="3.59091"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="3.49483"
        y1="7.74147"
        x2="0.58574"
        y2="11.3778"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="15.4143"
        y1="11.3778"
        x2="12.5053"
        y2="7.74146"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="2"
        y="0"
        width="13"
        height="10"
      >
        <rect x="2.18164" y="0.000244141" width="12.3636" height="9.45455" fill="#000" />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M12.704 5.45479C12.704 8.05304 10.5977 10.1593 7.99947 10.1593C5.40122 10.1593 3.29492 8.05304 3.29492 5.45479C3.29492 2.85654 5.40122 0.750244 7.99947 0.750244C10.5977 0.750244 12.704 2.85654 12.704 5.45479Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </g>
      <line
        x1="3.63672"
        y1="9.43201"
        x2="12.364"
        y2="9.43201"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default ClaimRewards;
